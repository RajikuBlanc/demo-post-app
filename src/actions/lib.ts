import { dataURLtoBuffer } from "@/lib/utils";
import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";

import { PrismaClient } from "@prisma/client";

// Prizma
declare global {
  var prisma: PrismaClient | undefined;
}
const prisma = global.prisma || new PrismaClient();
if (process.env.NODE_ENV === "development") global.prisma = prisma;

export const db = prisma;

// Cloudflare R2
const client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_ENDPOINT as string,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.CLOUDFLARE_ACCESS_KEY as string,
  },
});

// 画像アップロード処理
export const putImage = async (dataUrl: string, pathname: string) => {
  const file = dataURLtoBuffer(dataUrl);
  // アップロード用パラメーターの設定
  const uproadParams: PutObjectCommandInput = {
    Bucket: "demo-app",
    Key: pathname,
    Body: file,
    ContentType: "image/png",
    ACL: "public-read",
  };
  const command = new PutObjectCommand(uproadParams);
  await client.send(command);

  return `${process.env.IMAGE_HOST_URL}/${pathname}`;
};

// 画像削除処理
export const deleteImage = async (patthname: string) => {
  // 削除用パラメーターの設定
  const deleteParams: DeleteObjectCommandInput = {
    Bucket: "demo-app",
    Key: patthname,
  };
  const command = new DeleteObjectCommand(deleteParams);
  await client.send(command);
};
