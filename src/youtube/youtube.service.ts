import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CacheService } from 'src/cache/cache.service';
import { HttpServiceService } from 'src/http-service/http-service.service';

@Injectable()
export class YoutubeService {
  private readonly LOGGER = new Logger(YoutubeService.name);
  playlists: Array<{
    id: string;
    name: string;
    data: Array<any>;
  }> = [
    {
      id: 'PL6bwqqJO_txjsJYVHQuGMLAZW56jKqe37',
      name: 'Farms of the Week',
      data: [],
    },
    {
      id: 'PL6bwqqJO_txgGQySGK5-HSuTPp0LjeGqA',
      name: 'Crypto Market Wizards',
      data: [],
    },
  ];
  constructor(
    private readonly httpService: HttpServiceService,
    private readonly cacheService: CacheService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  getAllYoutubeList() {
    this.playlists.forEach((playlist) => {
      this.getYoutubePlaylist(playlist.id).subscribe({
        next: (res) => {
          // console.log("Res", res);
          this.cacheService.saveInCache(playlist.id, res.data);
        },
        error: (err) => {
          this.LOGGER.error('Error Getting Youtube Data: ', err);
        },
      });
    });
  }
  getYoutubePlaylist(playlistId: string) {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems`;
    return this.httpService.get(url, {
      part: 'contentDetails, snippet, id, status',
      key: process.env.YOUTUBE_APIKEY,
      playlistId: playlistId,
      maxResults: 10000,
    });
  }
  getPlaylistById(id: string) {
    return this.cacheService.get(id);
  }
}
