Page({
  data: {
    country: '',  // 存储输入的国家名称
    recommendedArticles:[],
    carouselImages: [
      "/images/c1.jpg",
      "/images/c2.jpg",
      "/images/c3.jpg",
      "/images/c4.jpg"
    ],
    carouselTexts: [
      "CHINA",
      "AMERICA",
      "UK",
      "FRENCH"
    ]
  },

  onLoad() {
    this.fetchRecommendations();
  },

  getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月份从0开始，需+1
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // 格式化为 YYYY-MM-DD

  },

  fetchRecommendations() {
    const currentDate = this.getCurrentDate(); // 动态获取当天日期
    const Url = `https://api.worldnewsapi.com/top-news?source-country=us&language=en&date=2025-01-18&api-key=6ad3b8f1da5a4f9b80968eef0db6c38b`;

    wx.request({
      url : Url, 
      method: "GET",
      success: (res) => {
        if (res.data && res.data.top_news) {
          // 访问 top_news 中的 news 数组
          const articles = res.data.top_news[0].news.map(item => ({
            title: item.title,  // 提取文章标题
            text: item.text,  // 提取图片 URL
            author: item.author,
            publish_date: item.publish_date,
            imageUrl: item.image,
          }));
          console.log(articles);

          // 更新到页面的 data 中
          this.setData({
            recommendedArticles: articles
            
          });
        } else {
          console.error('获取文章失败');
        }
      },
      fail: (err) => {
        console.error('API请求失败', err);
      }
    });
  },

  // 跳转到新页面展示文章文本
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

  onLoad() {
    this.fetchRecommendations();
  },

  // 监听输入框的输入
  onSearchInput(e) {
    this.setData({
      country: e.detail.value  // 更新输入的国家名称
    });
  },

  // 提交查询请求
  onSearchSubmit() {
    const { country } = this.data;

    if (!country) {
      wx.showToast({
        title: 'Please enter a country',
        icon: 'none'
      });
      return;
    }

    // 跳转到新闻页面并传递国家名称
    wx.navigateTo({
      url: `/pages/news/news?country=${encodeURIComponent(country)}`
    });
  }

});

