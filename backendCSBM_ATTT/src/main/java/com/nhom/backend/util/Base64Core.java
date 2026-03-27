package com.nhom.backend.util;

public final class Base64Core {

    private static final char[] ENCODE_TABLE = {
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
            'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
            'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
            'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
            'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
            'w', 'x', 'y', 'z', '0', '1', '2', '3',
            '4', '5', '6', '7', '8', '9', '+', '/'
    };

    private static final int[] DECODE_TABLE = new int[256];

    static {
        for (int i = 0; i < DECODE_TABLE.length; i++) {
            DECODE_TABLE[i] = -1;
        }
        for (int i = 0; i < ENCODE_TABLE.length; i++) {
            DECODE_TABLE[ENCODE_TABLE[i]] = i;
        }
        DECODE_TABLE['='] = 0;
    }

    private Base64Core() {
    }

    public static String encode(byte[] data) {
        return encodeInternal(data, true);
    }

    public static String encodeWithoutPadding(byte[] data) {
        return encodeInternal(data, false);
    }

    private static String encodeInternal(byte[] data, boolean withPadding) {
        if (data == null) {
            return null;
        }
        if (data.length == 0) {
            return "";
        }

        StringBuilder sb = new StringBuilder(((data.length + 2) / 3) * 4);

        for (int i = 0; i < data.length; i += 3) {
            int b0 = data[i] & 0xff;
            int b1 = (i + 1 < data.length) ? (data[i + 1] & 0xff) : 0;
            int b2 = (i + 2 < data.length) ? (data[i + 2] & 0xff) : 0;

            int block = (b0 << 16) | (b1 << 8) | b2;

            sb.append(ENCODE_TABLE[(block >>> 18) & 0x3f]);
            sb.append(ENCODE_TABLE[(block >>> 12) & 0x3f]);

            if (i + 1 < data.length) {
                sb.append(ENCODE_TABLE[(block >>> 6) & 0x3f]);
            } else if (withPadding) {
                sb.append('=');
            }

            if (i + 2 < data.length) {
                sb.append(ENCODE_TABLE[block & 0x3f]);
            } else if (withPadding) {
                sb.append('=');
            }
        }

        return sb.toString();
    }

    public static byte[] decode(String base64) {
        if (base64 == null) {
            return null;
        }

        String normalized = removeWhitespace(base64);
        if (normalized.isEmpty()) {
            return new byte[0];
        }

        int remainder = normalized.length() % 4;
        if (remainder != 0) {
            int padNeeded = 4 - remainder;
            StringBuilder padded = new StringBuilder(normalized);
            for (int i = 0; i < padNeeded; i++) {
                padded.append('=');
            }
            normalized = padded.toString();
        }

        validateBase64(normalized);

        int padding = 0;
        int len = normalized.length();
        if (len >= 1 && normalized.charAt(len - 1) == '=') {
            padding++;
        }
        if (len >= 2 && normalized.charAt(len - 2) == '=') {
            padding++;
        }

        int outputLength = (normalized.length() / 4) * 3 - padding;
        byte[] output = new byte[outputLength];

        int outIndex = 0;
        for (int i = 0; i < normalized.length(); i += 4) {
            int c0 = decodeChar(normalized.charAt(i));
            int c1 = decodeChar(normalized.charAt(i + 1));
            int c2 = decodeChar(normalized.charAt(i + 2));
            int c3 = decodeChar(normalized.charAt(i + 3));

            int block = (c0 << 18) | (c1 << 12) | (c2 << 6) | c3;

            if (outIndex < output.length) {
                output[outIndex++] = (byte) ((block >>> 16) & 0xff);
            }
            if (outIndex < output.length) {
                output[outIndex++] = (byte) ((block >>> 8) & 0xff);
            }
            if (outIndex < output.length) {
                output[outIndex++] = (byte) (block & 0xff);
            }
        }

        return output;
    }

    private static int decodeChar(char c) {
        if (c >= 256 || DECODE_TABLE[c] == -1) {
            throw new IllegalArgumentException("Invalid Base64 character: " + c);
        }
        return DECODE_TABLE[c];
    }

    private static String removeWhitespace(String input) {
        StringBuilder sb = new StringBuilder(input.length());
        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);
            if (!Character.isWhitespace(c)) {
                sb.append(c);
            }
        }
        return sb.toString();
    }

    private static void validateBase64(String input) {
        int paddingCount = 0;

        for (int i = 0; i < input.length(); i++) {
            char c = input.charAt(i);

            if (c == '=') {
                paddingCount++;
                if (i < input.length() - 2) {
                    throw new IllegalArgumentException("Invalid Base64 padding");
                }
            } else {
                if (paddingCount > 0) {
                    throw new IllegalArgumentException("Invalid Base64 padding position");
                }
                if (c >= 256 || DECODE_TABLE[c] == -1) {
                    throw new IllegalArgumentException("Invalid Base64 character: " + c);
                }
            }
        }

        if (paddingCount > 2) {
            throw new IllegalArgumentException("Invalid Base64 padding");
        }
    }
}