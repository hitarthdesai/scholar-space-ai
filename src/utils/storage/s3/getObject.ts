import {
  GetObjectCommand,
  type GetObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getS3Client } from "./getS3Client";

type getObjectProps = {
  fileName: string;
};

/**
 * Uploads specified file to the S3 bucket
 *
 * @param props Name of the file to be retrieved
 * @returns boolean indicating success or failure
 */
export async function getObject({ fileName }: getObjectProps) {
  try {
    const s3 = getS3Client();
    const params: GetObjectCommandInput = {
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: fileName,
    };

    const command = new GetObjectCommand(params);
    const data = await s3.send(command);

    const contents = await data.Body?.transformToString();
    return contents;
  } catch (e) {
    // console.error("Error in getObject", e);
    return undefined;
  }
}
