package com.quolance.quolance_api.entities;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class SocialMedia extends AbstractEntity{

    private String type;
    private String  url;

    public String getType() {
        return type;
    }

    public String getUrl() {
        return url;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
