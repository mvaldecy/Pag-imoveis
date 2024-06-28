package com.adm.imoveis;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;

@Configuration
public class OpenApiConfig {
    @Bean
    public OpenAPI imoveisOpenApi() {
        return new OpenAPI()
            .info(new Info()
                .title("Pag Imoveis API")
                .description("API para ser usado no gerenciamento do Pag Imoveis")
                .version("1.0"));       
    }
}
