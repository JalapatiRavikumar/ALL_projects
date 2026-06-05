package com.taskportal.dto;

import com.taskportal.entity.Task;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Task.TaskStatus status;
    private Task.TaskPriority priority;
    private String estimatedTime;
    private String blockchainHash;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
