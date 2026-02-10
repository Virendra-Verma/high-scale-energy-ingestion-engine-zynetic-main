import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SessionsService } from '../services/sessions.service';
import { CreateSessionDto } from '../dto';

@Controller('v1/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  /**
   * Start a new charging session
   * POST /v1/sessions/start
   */
  @Post('start')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  startSession(@Body() dto: CreateSessionDto) {
    return this.sessionsService.startSession(dto);
  }

  /**
   * End a charging session
   * POST /v1/sessions/:sessionId/end
   */
  @Post(':sessionId/end')
  endSession(@Param('sessionId') sessionId: string) {
    return this.sessionsService.endSession(sessionId);
  }

  /**
   * Get all active sessions
   * GET /v1/sessions/active
   */
  @Get('active')
  findActive() {
    return this.sessionsService.findActive();
  }

  /**
   * Get session by ID
   * GET /v1/sessions/:sessionId
   */
  @Get(':sessionId')
  findOne(@Param('sessionId') sessionId: string) {
    return this.sessionsService.findOne(sessionId);
  }
}
