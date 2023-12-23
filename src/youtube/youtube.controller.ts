import { Controller, Get, Param, Post } from '@nestjs/common';
import { YoutubeService } from './youtube.service';

@Controller('youtube')
export class YoutubeController {
  constructor(private youtubeService: YoutubeService) {}
  @Post()
  saveYoutubePlaylist() {
    return this.youtubeService.getAllYoutubeList();
  }
  @Get(':id')
  getPlaylistById(@Param('id') id: string) {
    return this.youtubeService.getPlaylistById(id);
  }
}
