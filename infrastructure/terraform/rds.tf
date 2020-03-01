module "database" {
  source                    = "https://modules.internal.firemind.io/terraform/production/database/aurora.tar.xz"
  SERVICE                   = "${var.SERVICE}-db"
  REGION                    = var.REGION
  STAGE                     = var.STAGE
  DB_NAME                   = var.SERVICE
  DB_MASTER_USER            = var.SERVICE
  DB_MASTER_PASSWORD        = var.DB_MASTER_PASSWORD
  DB_PARAMETER_GROUP        = aws_db_parameter_group.rds_pg.id
  PARAMETER_GROUP           = aws_rds_cluster_parameter_group.rds_cluster_pg.id
  DB_ENGINE                 = "aurora-mysql"
  DB_ENGINE_MODE            = "provisioned"
  ENGINE_VERSION            = "5.7.12"
  DB_SUBNETS                = module.network.public_subnets
  DB_SG                     = [aws_security_group.rds_DB.id]
  INSTANCE_TYPE             = "db.t3.small"
  NUMBER_OF_CLUSTERS        = 1
  MAX_NUMBER_OF_CLUSTERS    = 1
  AURORA_TARGET_VALUE       = 75
  AURORA_SCALE_IN_COOLDOWN  = 300
  AURORA_SCALE_OUT_COOLDOWN = 300
  PUBLICLY_ACCESSIBLE       = true
}

resource "aws_db_parameter_group" "rds_pg" {
  name   = "${var.SERVICE}-${var.STAGE}-pg"
  family = "aurora-mysql5.7"
}

resource "aws_rds_cluster_parameter_group" "rds_cluster_pg" {
  name        = "${var.SERVICE}-${var.STAGE}-cluster-pg"
  family      = "aurora-mysql5.7"
  description = "Cluster parameter group for APS cluster."

  parameter {
    name  = "max_connections"
    value = "16000"
  }
}

resource "aws_security_group" "rds_DB" {
  name        = "${var.SERVICE}-${var.STAGE}-RDS"
  description = "SG for RDS"
  vpc_id      = module.network.vpc_id
}

resource "aws_security_group_rule" "allow_from_lambda" {
  type      = "ingress"
  from_port = 3306
  to_port   = 3306
  protocol  = "tcp"

  source_security_group_id = aws_security_group.lambda.id
  description              = "Access from Lambda"
  security_group_id        = aws_security_group.rds_DB.id
}

resource "aws_security_group_rule" "allow_from_firemind" {
  type      = "ingress"
  from_port = 3306
  to_port   = 3306
  protocol  = "tcp"

  cidr_blocks = ["109.74.247.220/32"]
  description              = "Access from Firemind"
  security_group_id        = aws_security_group.rds_DB.id
}

resource "aws_kms_key" "db_key" {
  description             = "${var.SERVICE} ${var.STAGE} MySQL"
  deletion_window_in_days = 10
  is_enabled              = true
  enable_key_rotation     = true
}

resource "aws_kms_alias" "db_key" {
  name = "alias/${var.SERVICE}-${var.STAGE}-Database"
  target_key_id = "${aws_kms_key.db_key.key_id}"
}

resource "aws_db_subnet_group" "default" {
  name       = "${var.SERVICE}-${var.STAGE}"
  subnet_ids = module.network.public_subnets

  tags = {
    Name = "${var.SERVICE}-${var.STAGE}"
  }
}
