package com.aihealthos.controller;

import com.aihealthos.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/files")
@Tag(name = "Files", description = "File management APIs")
public class FileController {

    private static final Logger log = LoggerFactory.getLogger(FileController.class);

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping("/{filePath:.+}")
    @Operation(summary = "Get file by path", description = "Retrieve and serve a file from the storage")
    public ResponseEntity<?> getFile(@PathVariable String filePath) {
        try {
            // Remove any leading slashes that might cause path issues
            if (filePath.startsWith("/")) {
                filePath = filePath.substring(1);
            }
            
            byte[] data = fileStorageService.readFile(filePath);
            Resource resource = new ByteArrayResource(data);
            
            // Determine media type based on file extension
            MediaType mediaType = getMediaType(filePath);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filePath + "\"")
                    .contentType(mediaType)
                    .contentLength(data.length)
                    .body(resource);
        } catch (Exception e) {
            log.error("Error serving file: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    private MediaType getMediaType(String filePath) {
        if (filePath == null) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
        
        String lowerPath = filePath.toLowerCase();
        if (lowerPath.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        } else if (lowerPath.endsWith(".jpg") || lowerPath.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG;
        } else if (lowerPath.endsWith(".gif")) {
            return MediaType.valueOf("image/gif");
        } else if (lowerPath.endsWith(".pdf")) {
            return MediaType.APPLICATION_PDF;
        }
        
        return MediaType.APPLICATION_OCTET_STREAM;
    }
}
