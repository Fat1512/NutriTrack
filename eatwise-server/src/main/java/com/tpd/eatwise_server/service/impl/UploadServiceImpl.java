//package com.tpd.eatwise_server.service.impl;
//
//import com.tpd.eatwise_server.dto.response.MessageResponse;
//import com.tpd.eatwise_server.service.UploadService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//import software.amazon.awssdk.services.s3.S3Client;
//import software.amazon.awssdk.services.s3.model.PutObjectRequest;
//import software.amazon.awssdk.services.s3.model.PutObjectResponse;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.StandardCopyOption;
//
//@Service
//@RequiredArgsConstructor
//public class UploadServiceImpl implements UploadService {
//    private final S3Client s3Client;
//
//    @Value("${aws.s3.bucketName}")
//    private String bucketName;
//
//    @Value("${aws.region}")
//    private String region;
//
//    @Override
//    public MessageResponse uploadImage(MultipartFile file) {
//        try {
//            // Create a temp file
//            Path tempFile = Files.createTempFile("upload-", file.getOriginalFilename());
//            Files.copy(file.getInputStream(), tempFile, StandardCopyOption.REPLACE_EXISTING);
//
//
//            String key = "uploads/" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
//
//            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
//                    .bucket(bucketName)
//                    .key(key)
//                    .contentType(file.getContentType())
//                    .build();
//
//            PutObjectResponse response = s3Client.putObject(
//                    putObjectRequest,
//                    tempFile
//            );
//            String url = String.format("https://%s.s3.%s.amazonaws.com/%s",
//                    bucketName,
//                    s3Client.serviceClientConfiguration().region().id(),
//                    key
//            );
//
//            return MessageResponse.builder()
//                    .message("Successfully upload image")
//                    .status(HttpStatus.CREATED)
//                    .data(url)
//                    .build();
//
//        } catch (IOException e) {
//            throw new RuntimeException("Failed to upload image to S3", e);
//        }
//    }
//}
