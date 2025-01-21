Page({
  data: {
    country: '',  // 存储传递的国家名称
    articles: []  // 存储新闻列表
  },

  onLoad(options) {
    if (options.country) {
      this.setData({
        country: decodeURIComponent(options.country)  // 获取并解码传递的国家名称
      });
      this.fetchNewsByCountry(this.data.country);  // 获取该国家的新闻
    }
  },

  // 获取该国家的新闻
  fetchNewsByCountry(country) {
    const currentDate = this.getCurrentDate(); // 获取当前日期
    const url = `https://api.worldnewsapi.com/top-news?source-country=${country}&language=en&date=2025-01-19&api-key=6ad3b8f1da5a4f9b80968eef0db6c38b`;

    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        if (res.data && res.data.top_news) {
          const articles = res.data.top_news[0].news.map(item => ({
            title: item.title,  // 提取文章标题
            text: item.text,  // 提取图片 URL
            author: item.author,
            publish_date: item.publish_date,
            imageUrl: item.image,
          }));

          // 更新新闻列表
          this.setData({
            articles: articles
          });
        } else {
          wx.showToast({
            title: 'No news found for this country',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('API 请求失败', err);
        wx.showToast({
          title: 'Failed to fetch news',
          icon: 'none'
        });
      }
    });
  },

  goToArticle(e) {
    const articleText = e.currentTarget.dataset.text;  // 获取绑定的文章内容
    const articleTitle = e.currentTarget.dataset.title;
    const articleAuthor = e.currentTarget.dataset.author;
    const artdate = e.currentTarget.dataset.publish_date;
    const articleImage = e.currentTarget.dataset.imageurl;
    wx.navigateTo({
      url: `/pages/webview/webview?title=${encodeURIComponent(articleTitle)}&text=${encodeURIComponent(articleText)}&author=${encodeURIComponent(articleAuthor)}&publish_date=${encodeURIComponent(artdate)}&imageUrl=${encodeURIComponent(articleImage)}`  // 跳转到文章页面，并传递文章文本
    });
  },

  // 获取当前日期（YYYY-MM-DD）
  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需+1
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // 格式化为 YYYY-MM-DD
  }
});