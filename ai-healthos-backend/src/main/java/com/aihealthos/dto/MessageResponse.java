package com.aihealthos.dto;

public class MessageResponse {

    private String message;
    private boolean success;
    private Object data;

    public MessageResponse() {
    }

    public MessageResponse(String message) {
        this.message = message;
        this.success = true;
    }

    public MessageResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }

    public MessageResponse(String message, boolean success, Object data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public static MessageResponseBuilder builder() {
        return new MessageResponseBuilder();
    }

    public static class MessageResponseBuilder {
        private String message;
        private boolean success;
        private Object data;

        public MessageResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public MessageResponseBuilder success(boolean success) {
            this.success = success;
            return this;
        }

        public MessageResponseBuilder data(Object data) {
            this.data = data;
            return this;
        }

        public MessageResponse build() {
            MessageResponse response = new MessageResponse();
            response.setMessage(message);
            response.setSuccess(success);
            response.setData(data);
            return response;
        }
    }
}
