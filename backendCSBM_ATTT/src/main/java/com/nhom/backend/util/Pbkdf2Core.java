package com.nhom.backend.util;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;

public class Pbkdf2Core {

    private Pbkdf2Core() {
    }

    public static byte[] hmacSha256(byte[] key, byte[] message) {
        int blockSize = 64;

        if (key.length > blockSize) {
            key = Sha256Core.sha256(key);
        }

        if (key.length < blockSize) {
            byte[] paddedKey = new byte[blockSize];
            System.arraycopy(key, 0, paddedKey, 0, key.length);
            key = paddedKey;
        }

        byte[] oKeyPad = new byte[blockSize];
        byte[] iKeyPad = new byte[blockSize];

        for (int i = 0; i < blockSize; i++) {
            oKeyPad[i] = (byte) (key[i] ^ 0x5c);
            iKeyPad[i] = (byte) (key[i] ^ 0x36);
        }

        byte[] inner = new byte[iKeyPad.length + message.length];
        System.arraycopy(iKeyPad, 0, inner, 0, iKeyPad.length);
        System.arraycopy(message, 0, inner, iKeyPad.length, message.length);

        byte[] innerHash = Sha256Core.sha256(inner);

        byte[] outer = new byte[oKeyPad.length + innerHash.length];
        System.arraycopy(oKeyPad, 0, outer, 0, oKeyPad.length);
        System.arraycopy(innerHash, 0, outer, oKeyPad.length, innerHash.length);

        return Sha256Core.sha256(outer);
    }

    public static byte[] deriveKey(String password, byte[] salt, int iterations, int dkLen) {
        byte[] passwordBytes = password.getBytes(StandardCharsets.UTF_8);
        int hLen = 32;
        int l = (int) Math.ceil((double) dkLen / hLen);

        byte[] derivedKey = new byte[l * hLen];
        int destPos = 0;

        for (int i = 1; i <= l; i++) {
            byte[] iBytes = new byte[]{
                    (byte) (i >>> 24),
                    (byte) (i >>> 16),
                    (byte) (i >>> 8),
                    (byte) i
            };

            byte[] saltPlusIndex = new byte[salt.length + 4];
            System.arraycopy(salt, 0, saltPlusIndex, 0, salt.length);
            System.arraycopy(iBytes, 0, saltPlusIndex, salt.length, 4);

            byte[] u = hmacSha256(passwordBytes, saltPlusIndex);
            byte[] t = u.clone();

            for (int j = 1; j < iterations; j++) {
                u = hmacSha256(passwordBytes, u);
                for (int k = 0; k < t.length; k++) {
                    t[k] ^= u[k];
                }
            }

            System.arraycopy(t, 0, derivedKey, destPos, t.length);
            destPos += t.length;
        }

        byte[] result = new byte[dkLen];
        System.arraycopy(derivedKey, 0, result, 0, dkLen);
        return result;
    }

    public static byte[] randomSalt(int len) {
        byte[] salt = new byte[len];
        new SecureRandom().nextBytes(salt);
        return salt;
    }

    public static String encodePbkdf2(String password, byte[] salt, int iterations, int dkLen) {
        byte[] key = deriveKey(password, salt, iterations, dkLen);
        return "pbkdf2_sha256$" + iterations + "$"
                + Base64Core.encodeWithoutPadding(salt)
                + "$"
                + Base64Core.encodeWithoutPadding(key);
    }

    public static boolean verifyPassword(String rawPassword, String encoded) {
        String[] parts = encoded.split("\\$");
        if (parts.length != 4) {
            return false;
        }

        int iterations = Integer.parseInt(parts[1]);
        byte[] salt = Base64Core.decode(parts[2]);
        byte[] expected = Base64Core.decode(parts[3]);

        byte[] actual = deriveKey(rawPassword, salt, iterations, expected.length);

        if (actual.length != expected.length) {
            return false;
        }

        int diff = 0;
        for (int i = 0; i < actual.length; i++) {
            diff |= actual[i] ^ expected[i];
        }
        return diff == 0;
    }
}