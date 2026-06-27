<template>
  <view class="container">
    <view class="result-header">
      <view class="result-icon">📊</view>
      <view class="result-title">练习结果</view>
      <view class="result-sub">三种模式练习情况汇总</view>
    </view>

    <view class="result-card">
      <view class="card-row">
        <view class="card-item">
          <view class="item-val choice-val">{{ choiceCorrect }} / {{ total }}</view>
          <view class="item-label">选择题正确</view>
        </view>
        <view class="card-item">
          <view class="item-val fill-val" v-if="fillTotal > 0">{{ fillCorrect }} / {{ fillTotal }}</view>
          <view class="item-val fill-val" v-else>未做</view>
          <view class="item-label">填空题正确</view>
        </view>
        <view class="card-item">
          <view class="item-val answer-val">{{ answerTotal }} / {{ total }}</view>
          <view class="item-label">简答题已查看</view>
        </view>
      </view>
    </view>

    <view class="advice-card">
      <view class="advice-title">练习建议</view>
      <view class="advice-list">
        <view class="advice-item">
          <text class="advice-dot">1</text>
          <text class="advice-text">选择题是基础，先通过选择题记住每个问题的正确答案</text>
        </view>
        <view class="advice-item">
          <text class="advice-dot">2</text>
          <text class="advice-text">填空题加深记忆，需要准确记住关键词和关键数据</text>
        </view>
        <view class="advice-item">
          <text class="advice-dot">3</text>
          <text class="advice-text">简答题是终极目标，不看答案能完整回答才算真正掌握</text>
        </view>
      </view>
    </view>

    <view class="bottom-btns">
      <view class="btn btn-back" @click="goHome">返回首页</view>
      <view class="btn btn-retry" @click="retryPractice">重新练习</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      total: 0,
      choiceCorrect: 0,
      fillCorrect: 0,
      fillTotal: 0,
      answerTotal: 0
    }
  },
  onLoad(options) {
    this.total = parseInt(options.total) || 0
    this.choiceCorrect = parseInt(options.choiceCorrect) || 0
    this.fillCorrect = parseInt(options.fillCorrect) || 0
    this.fillTotal = parseInt(options.fillTotal) || 0
    this.answerTotal = parseInt(options.answerTotal) || 0
  },
  methods: {
    goHome() {
      uni.navigateBack({
        delta: 2
      })
    },
    retryPractice() {
      uni.navigateBack({
        delta: 1
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 40rpx 30rpx;
}
.result-header {
  text-align: center;
  margin-bottom: 40rpx;
}
.result-icon {
  font-size: 80rpx;
}
.result-title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  margin-top: 16rpx;
}
.result-sub {
  font-size: 26rpx;
  color: #999;
  margin-top: 8rpx;
}
.result-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.card-row {
  display: flex;
  justify-content: space-around;
}
.card-item {
  text-align: center;
}
.item-val {
  font-size: 44rpx;
  font-weight: bold;
  margin-bottom: 8rpx;
}
.choice-val { color: #4A90D9; }
.fill-val { color: #7B4FD9; }
.answer-val { color: #D97B4A; }
.item-label {
  font-size: 24rpx;
  color: #999;
}
.advice-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.advice-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}
.advice-list {
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}
.advice-item {
  display: flex;
  align-items: flex-start;
}
.advice-dot {
  width: 40rpx;
  height: 40rpx;
  background: #f0f4ff;
  color: #4A90D9;
  text-align: center;
  line-height: 40rpx;
  border-radius: 50%;
  font-size: 24rpx;
  font-weight: bold;
  flex-shrink: 0;
  margin-right: 16rpx;
}
.advice-text {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
.bottom-btns {
  display: flex;
  gap: 20rpx;
}
.btn {
  flex: 1;
  text-align: center;
  padding: 22rpx;
  border-radius: 14rpx;
  font-size: 28rpx;
  font-weight: bold;
}
.btn-back {
  background: #f5f5f5;
  color: #666;
}
.btn-retry {
  background: linear-gradient(135deg, #4A90D9, #357ABD);
  color: #fff;
}
</style>