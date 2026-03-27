package com.nhom.backend.util;

import java.nio.charset.StandardCharsets;

public class CryptoFieldUtil {

    private CryptoFieldUtil() {
    }

    public static String encryptString(String plainText, byte[] aesKey) {
        if (plainText == null) {
            return null;
        }
        byte[] encrypted = AesCore.encrypt(plainText.getBytes(StandardCharsets.UTF_8), aesKey);
        return Base64Core.encode(encrypted);
    }

    public static String decryptString(String cipherBase64, byte[] aesKey) {
        if (cipherBase64 == null) {
            return null;
        }
        byte[] cipherBytes = Base64Core.decode(cipherBase64);
        byte[] plainBytes = AesCore.decrypt(cipherBytes, aesKey);
        return new String(plainBytes, StandardCharsets.UTF_8);
    }

    public static String mask(String value) {
        if (value == null || value.isBlank()) {
            return "****";
        }
        return "****";
    }
}