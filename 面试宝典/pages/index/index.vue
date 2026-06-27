<template>
  <view class="container">
    <view class="header">
      <view class="header-title">面试宝典</view>
      <view class="header-sub">PMC面试75题 · 三种模式 · 全面掌握</view>
    </view>

    <view class="section-title">
      <text>题目分类</text>
    </view>

    <view class="category-list">
      <view
        v-for="cat in categories"
        :key="cat.key"
        class="category-card"
        @click="goPractice(cat.key)"
      >
        <view class="card-left">
          <view class="card-icon" :style="{ background: cat.color }">
            <text class="icon-text">{{ cat.icon }}</text>
          </view>
        </view>
        <view class="card-mid">
          <view class="card-name">{{ cat.name }}</view>
          <view class="card-desc">{{ cat.desc }}</view>
        </view>
        <view class="card-right">
          <view class="card-count">{{ cat.count }}题</view>
          <view class="card-arrow">></view>
        </view>
      </view>
    </view>

    <view class="section-title">
      <text>全部题目</text>
    </view>

    <view class="all-btn" @click="goPractice('all')">
      <view class="all-btn-icon-wrap">
        <text class="all-btn-icon">📋</text>
      </view>
      <view class="all-btn-text">
        <text class="all-btn-title">全部75题</text>
        <text class="all-btn-sub">包含通用、跟单、生产、物料、计划、采购六大类</text>
      </view>
      <view class="all-btn-arrow">></view>
    </view>

    <view class="section-title">
      <text>练习模式说明</text>
    </view>

    <view class="mode-list">
      <view class="mode-item">
        <view class="mode-badge choice">选择题</view>
        <view class="mode-text">四选一，点选后即时判断对错，记住正确答案</view>
      </view>
      <view class="mode-item">
        <view class="mode-badge fill">填空题</view>
        <view class="mode-text">关键词填空，输入后校验，增强记忆印象</view>
      </view>
      <view class="mode-item">
        <view class="mode-badge answer">简答题</view>
        <view class="mode-text">看题回忆答案，点击查看完整答案，最终记住</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      categories: [
        { key: '通用', name: '通用问题', desc: '自我介绍、薪资、离职原因等', icon: '通', color: '#4A90D9', count: 14 },
        { key: '跟单', name: '跟单相关', desc: 'ERP操作、工艺流程、KPI等', icon: '跟', color: '#7B4FD9', count: 14 },
        { key: '生产相关', name: '生产相关', desc: '产能、异常处理、排产等', icon: '产', color: '#D94A7B', count: 15 },
        { key: '物料相关', name: '物料相关', desc: '来料不良、欠料、物控等', icon: '物', color: '#D97B4A', count: 14 },
        { key: '计划相关', name: '计划相关', desc: 'PMC理解、计划达成率等', icon: '计', color: '#4AD9A0', count: 17 },
        { key: '采购相关', name: '采购相关', desc: '采购岗位面试要点', icon: '采', color: '#D9A04A', count: 1 }
      ]
    }
  },
  methods: {
    goPractice(cat) {
      uni.navigateTo({
        url: '/pages/practice/practice?category=' + encodeURIComponent(cat)
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20rpx 30rpx 40rpx;
}
.header {
  background: linear-gradient(135deg, #4A90D9, #357ABD);
  border-radius: 24rpx;
  padding: 50rpx 36rpx;
  margin-bottom: 36rpx;
}
.header-title {
  font-size: 48rpx;
  font-weight: bold;
  color: #fff;
}
.header-sub {
  font-size: 26rpx;
  color: rgba(255,255,255,0.8);
  margin-top: 10rpx;
}
.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin: 30rpx 0 20rpx;
  padding-left: 10rpx;
}
.category-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.category-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.card-left {
  margin-right: 20rpx;
}
.card-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-text {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
}
.card-mid {
  flex: 1;
}
.card-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.card-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 4rpx;
}
.card-right {
  text-align: right;
}
.card-count {
  font-size: 28rpx;
  color: #4A90D9;
  font-weight: bold;
}
.card-arrow {
  font-size: 24rpx;
  color: #ccc;
  margin-top: 4rpx;
}
.all-btn {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.all-btn-icon-wrap {
  width: 80rpx;
  height: 80rpx;
  background: #f0f4ff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}
.all-btn-icon {
  font-size: 36rpx;
}
.all-btn-text {
  flex: 1;
}
.all-btn-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}
.all-btn-sub {
  display: block;
  font-size: 22rpx;
  color: #999;
  margin-top: 4rpx;
}
.all-btn-arrow {
  font-size: 24rpx;
  color: #ccc;
}
.mode-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.mode-item {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.03);
}
.mode-badge {
  width: 100rpx;
  height: 56rpx;
  border-radius: 10rpx;
  text-align: center;
  line-height: 56rpx;
  font-size: 24rpx;
  color: #fff;
  font-weight: bold;
  flex-shrink: 0;
  margin-right: 20rpx;
}
.mode-badge.choice { background: #4A90D9; }
.mode-badge.fill { background: #7B4FD9; }
.mode-badge.answer { background: #D97B4A; }
.mode-text {
  font-size: 24rpx;
  color: #666;
  flex: 1;
}
</style>