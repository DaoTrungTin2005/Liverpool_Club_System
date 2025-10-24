// src/main/java/vn/liverpool/validation/UniqueEmailValidator.java
package vn.liverpool.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import vn.liverpool.repository.AccountRepository;

// Ấy trong repository để coi có trùng email ko
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {

    @Autowired
    private AccountRepository accountRepository;

    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        if (email == null) return true; // @NotBlank sẽ bắt
        return accountRepository.findByEmail(email).isEmpty();
    }
}