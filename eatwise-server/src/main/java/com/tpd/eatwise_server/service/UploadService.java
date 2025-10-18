package com.tpd.eatwise_server.service;

import com.tpd.eatwise_server.dto.response.MessageResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UploadService {

    MessageResponse uploadImage(MultipartFile file);
}
