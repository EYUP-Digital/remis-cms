module.exports = {
  '*/1 * * * *': {
    task: async () => {

      // // fetch articles to publish
      const insightsToBePublished = await strapi.db.query('api::insight.insight').findMany({
        where: {
          publishedAt: {
            $null: true
          },
          publishAt: {
            $lt: new Date()
          }
        }
      });

      await Promise.all(insightsToBePublished.map(insight => {
        return strapi.service('api::insight.insight').update(
          { id: insight.id },
          { publishedAt: new Date() }
        );
      }));
    },
    options: {
      tz: 'Europe/London',
    }
  }
};
