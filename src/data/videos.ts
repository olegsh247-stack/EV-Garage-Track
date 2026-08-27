export type VideoReview = {
  youtubeId: string;
  title: string;
  channel: string;
  brandSlug: string;
  modelSlug: string;
};

// ТОЛЬКО официальные видео с официальных YouTube-каналов производителей.
// Для коммерческих моделей официальные ролики добавляются по мере появления.
// Блок «Видеообзоры» на главной автоматически скрывается, пока список пуст.
export const videoReviews: VideoReview[] = [];
