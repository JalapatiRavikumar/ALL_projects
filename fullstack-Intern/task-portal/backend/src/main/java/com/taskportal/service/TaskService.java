package com.taskportal.service;

import com.taskportal.entity.Task;
import com.taskportal.entity.User;
import com.taskportal.repository.TaskRepository;
import com.taskportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Task> getAllTasksByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByUserId(user.getId());
    }
    
    public Task getTaskById(Long taskId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }
    
    @Transactional
    public Task createTask(Task task, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        task.setUser(user);
        task.setBlockchainHash(generateBlockchainHash(task));
        return taskRepository.save(task);
    }
    
    @Transactional
    public Task updateTask(Long taskId, Task taskDetails, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setEstimatedTime(taskDetails.getEstimatedTime());
        
        // Regenerate blockchain hash on update
        task.setBlockchainHash(generateBlockchainHash(task));
        
        return taskRepository.save(task);
    }
    
    @Transactional
    public void deleteTask(Long taskId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        taskRepository.delete(task);
    }
    
    /**
     * Generates a mocked blockchain hash for the task
     * Simulates immutable ledger tracking
     */
    private String generateBlockchainHash(Task task) {
        try {
            String data = task.getTitle() + 
                         task.getDescription() + 
                         task.getStatus() + 
                         LocalDateTime.now().toString() +
                         UUID.randomUUID().toString();
            
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(data.getBytes("UTF-8"));
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            // Fallback to UUID if SHA-256 fails
            return UUID.randomUUID().toString().replace("-", "");
        }
    }
}
