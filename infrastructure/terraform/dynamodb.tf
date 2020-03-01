module "user-sessions" {
  source        = "https://modules.internal.firemind.io/terraform/production/dynamodb/table-with-autoscaling.tar.xz"
  TABLE_NAME    = "user-sessions"
  HASH_KEY      = "sessionToken"
  HASH_KEY_TYPE = "S"

  SERVICE = "${var.SERVICE}"
  STAGE   = "${var.STAGE}"

  TTL_ENABLED        = true
  TTL_ATTRIBUTE_NAME = "ttl"

  SSE_ENABLED = true

  INITIAL_READ_CAPACITY  = 1
  INITIAL_WRITE_CAPACITY = 1

  READ_CAPACITY_MIN  = 1
  WRITE_CAPACITY_MIN = 1
  READ_CAPACITY_MAX  = 100
  WRITE_CAPACITY_MAX = 100

  READ_TARGET_UTILIZATION  = 80
  WRITE_TARGET_UTILIZATION = 80
}
