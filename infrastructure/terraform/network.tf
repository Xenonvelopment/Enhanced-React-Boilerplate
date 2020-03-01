module "network" {
  source            = "https://modules.internal.firemind.io/terraform/production/network/base.tar.xz"
  SERVICE           = "${var.SERVICE}"
  REGION            = "${var.REGION}"
  STAGE             = "${var.STAGE}"
  MASK              = "16"
  CIDR_BLOCK        = "10.64.0.0"
  CIDR_BLOCK_PREFIX = "10.64"
  HOSTED_ZONE       = "vf-voice"
}

resource "aws_security_group" "lambda" {
  name        = "${var.SERVICE}-${var.STAGE}-Lambda"
  description = "SG for Lambda"
  vpc_id      = module.network.vpc_id
}

resource "aws_security_group_rule" "allow_db_from_lambda" {
  type      = "egress"
  from_port = 3306
  to_port   = 3306
  protocol  = "tcp"

  security_group_id           = aws_security_group.lambda.id
  description                 = "Access  Lambda"
  source_security_group_id    = aws_security_group.rds_DB.id
}

resource "aws_security_group_rule" "allow_internet_from_lambda" {
  type      = "egress"
  from_port = 0
  to_port   = 65535
  protocol  = "tcp"

  cidr_blocks = ["0.0.0.0/0"]
  ipv6_cidr_blocks = ["::/0"]

  description              = "Access  Lambda"
  security_group_id        = aws_security_group.lambda.id
}
