
package vn.liverpool.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;


//cấu hình lại Bean validator mặc định
@Configuration
public class ValidationConfig {

    @Bean
    public LocalValidatorFactoryBean validator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();

        //true: dừng validation ngay khi gặp lỗi đầu tiên
        //false: kiểm tra tất cả các trường và trả về tất cả lỗi
        bean.getValidationPropertyMap().put("hibernate.validator.fail_fast", "false");
        return bean;
    }
}