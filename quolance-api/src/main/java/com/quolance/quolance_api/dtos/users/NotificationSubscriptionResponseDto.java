package com.quolance.quolance_api.dtos.users;

import com.quolance.quolance_api.entities.User;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class NotificationSubscriptionResponseDto {
    private Boolean subscribed;

    public NotificationSubscriptionResponseDto(User user) {
        this.subscribed = user.isNotificationsSubscribed();
    }
}
