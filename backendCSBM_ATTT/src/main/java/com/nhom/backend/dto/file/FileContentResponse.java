package com.nhom.backend.dto.file;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FileContentResponse {
    private Long fileId;
    private String originalFileName;
    private String content;
    private String message;
}