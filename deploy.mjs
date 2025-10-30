import AWS from "aws-sdk";
import fs from "fs";
import path from "path";
import mime from "mime";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const mappedProjectName = "stats";

const distPath = path.join(__dirname, "dist");

const endpoint = new AWS.Endpoint(process.env.NCP_ENDPOINT);

AWS.config.update({
  accessKeyId: process.env.NCP_ACCESS_KEY_ID,
  secretAccessKey: process.env.NCP_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3({
  endpoint: endpoint,
  region: "kr-standard",
  s3ForcePathStyle: true,
});

const bucketName = "build-artifacts";

// 기존 파일 삭제 함수
const deleteOldFiles = async () => {
  const prefix = `${mappedProjectName}/`;
  let isTruncated = true;
  let continuationToken = null;

  while (isTruncated) {
    const listParams = {
      Bucket: bucketName,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    };

    try {
      const listedObjects = await s3.listObjectsV2(listParams).promise();
      if (listedObjects.Contents.length === 0) break;

      const deleteParams = {
        Bucket: bucketName,
        Delete: {
          Objects: listedObjects.Contents.map(({ Key }) => ({ Key })),
        },
      };

      await s3.deleteObjects(deleteParams).promise();
      console.log(`Deleted ${listedObjects.Contents.length} objects in ${prefix}`);

      isTruncated = listedObjects.IsTruncated;
      continuationToken = listedObjects.NextContinuationToken;
    } catch (err) {
      console.error(`Failed to delete files in ${prefix}: ${err}`);
      break;
    }
  }
};

// 파일 업로드 함수
const uploadFile = async (filePath, bucket, key) => {
  const fileContent = fs.readFileSync(filePath);
  const contentType = mime.getType(filePath) || "application/octet-stream";

  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
  };

  try {
    await s3.upload(params).promise();
    console.log(`Uploaded ${filePath} to ${bucket}/${key}`);
  } catch (err) {
    console.error(`Failed to upload ${filePath}: ${err}`);
  }
};

// 디렉토리 업로드 함수
const uploadDirectory = async (localDir, bucket, rootDir = localDir) => {
  const entries = fs.readdirSync(localDir);

  for (const entry of entries) {
    const fullPath = path.join(localDir, entry);
    const stats = fs.lstatSync(fullPath);

    if (stats.isDirectory()) {
      await uploadDirectory(fullPath, bucket, rootDir);
    } else {
      // 상대 경로로 S3 Key 생성
      const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, "/");
      const s3Key = `${mappedProjectName}/${relativePath}`;

      await uploadFile(fullPath, bucket, s3Key);
    }
  }
};

// 업로드 실행
(async () => {
  console.log(`Deleting old files in ${bucketName}...`);
  await deleteOldFiles();

  console.log(`Uploading project ${mappedProjectName} from ${distPath} to bucket ${bucketName}`);
  await uploadDirectory(distPath, bucketName);

  console.log(`Project ${mappedProjectName} uploaded successfully!`);
})();
