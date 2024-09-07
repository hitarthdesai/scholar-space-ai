import { PutObjectCommand, type PutObjectCommandInput } from "@aws-sdk/client-s3";
import { getS3Client } from "./getS3Client";

type PutObjectProps = {
  body: Buffer;
  fileName: string;
  contentType: string;
};

/**
 * Uploads specified file to the S3 bucket
 *
 * @param props File name, body and content type
 * @returns boolean indicating success or failure
 */
export async function putObject({
  fileName,
  body,
  contentType,
}: PutObjectProps) {
  try {
    const s3 = getS3Client();
    const params: PutObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileName,
      ContentType: contentType,
      Body: body,
    };

    const command = new PutObjectCommand(params);
    const {
      $metadata: { httpStatusCode },
    } = await s3.send(command);

    return httpStatusCode === 200;
  } catch (e) {
    console.error("Error in putObject", e);
    return false;
  }
}
