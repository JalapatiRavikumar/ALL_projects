package com.taskportal.controller;

import com.taskportal.dto.TaskRequest;
import com.taskportal.dto.TaskResponse;
import com.taskportal.entity.Task;
import com.taskportal.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    private String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
    
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        String username = getCurrentUsername();
        List<Task> tasks = taskService.getAllTasksByUser(username);
        List<TaskResponse> response = tasks.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable Long id) {
        String username = getCurrentUsername();
        Task task = taskService.getTaskById(id, username);
        return ResponseEntity.ok(convertToResponse(task));
    }
    
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        String username = getCurrentUsername();
        Task task = convertToEntity(request);
        Task createdTask = taskService.createTask(task, username);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToResponse(createdTask));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody TaskRequest request) {
        String username = getCurrentUsername();
        Task task = convertToEntity(request);
        Task updatedTask = taskService.updateTask(id, task, username);
        return ResponseEntity.ok(convertToResponse(updatedTask));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        String username = getCurrentUsername();
        taskService.deleteTask(id, username);
        return ResponseEntity.noContent().build();
    }
    
    private Task convertToEntity(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : Task.TaskStatus.TODO);
        task.setPriority(request.getPriority() != null ? request.getPriority() : Task.TaskPriority.MEDIUM);
        task.setEstimatedTime(request.getEstimatedTime());
        return task;
    }
    
    private TaskResponse convertToResponse(Task task) {
        TaskResponse response = new TaskResponse();
        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());
        response.setPriority(task.getPriority());
        response.setEstimatedTime(task.getEstimatedTime());
        response.setBlockchainHash(task.getBlockchainHash());
        response.setCreatedAt(task.getCreatedAt());
        response.setUpdatedAt(task.getUpdatedAt());
        return response;
    }
}
