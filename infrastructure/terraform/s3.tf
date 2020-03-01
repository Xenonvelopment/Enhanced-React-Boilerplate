### S3 Bucket 1

resource "aws_s3_bucket" "my-first-bucket" {
  bucket_prefix = "${var.SERVICE}-${var.STAGE}-"

  acl = "private"

  versioning {
    enabled = true
  }
}

