const baseUrl = "https://jadx-temp-1.s3.ap-northeast-2.amazonaws.com";

export const getGeoJson = (objectKey: string) => {
    const response = fetch(`${baseUrl}/${objectKey}`).then((response) => response.json());
    return response;
};
