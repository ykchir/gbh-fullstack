import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./infrastructure/http/nest/app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000;

  app.setGlobalPrefix("api");
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);

  console.log(
    `🚀 🚀 🚀  GBH-BACKEND is running on: http://localhost:${PORT} 🚀 🚀 🚀 `,
  );
}

void bootstrap();
