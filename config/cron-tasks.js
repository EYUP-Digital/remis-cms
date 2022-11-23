module.exports = {
  '*/1 * * * *': {
    task: async () => {

      // fetch articles to publish
      const draftArticleToPublish = await strapi.entityService.findMany('api::insight.insight', {
        filters: {
          publishedAt: { $null: true },
          publish_at: { $lt: new Date() },
        },
        publicationState: 'preview'
      });

      // update published_at of articles
      await Promise.all(draftArticleToPublish.map(article => {
        return strapi.entityService.update('api::article.article', article.id, {
          data: {
            publishedAt: new Date(),
          },
        });
      }));
    },
    options: {
      tz: 'Europe/London',
    }
  }
};
