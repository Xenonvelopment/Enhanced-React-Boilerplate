output RDS_PASSWORD {
  value     = "${var.DB_MASTER_PASSWORD}"
  sensitive = true
}

output RDS_ENDPOINT {
  value = "${module.database.DB_ENDPOINT}"
}

output RDS_ENDPOINT_READER {
  value = "${module.database.DB_ENDPOINT_READER}"
}

output RDS_PORT {
  value = "${module.database.DB_PORT}"
}

output RDS_CLUSTER_ID {
  value = "${module.database.DB_CLUSTER_ID}"
}
