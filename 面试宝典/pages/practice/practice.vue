<template>
  <view class="container">
    <view class="top-bar">
      <view class="progress-wrap">
        <view class="progress-bar">
          <view class="progress-fill" :style="{ width: ((currentIndex + 1) / questions.length * 100) + '%' }"></view>
        </view>
        <text class="progress-text">{{ currentIndex + 1 }} / {{ questions.length }}</text>
      </view>
    </view>

    <view class="mode-tabs">
      <view
        v-for="(mode, idx) in modes"
        :key="idx"
        class="mode-tab"
        :class="{ active: currentMode === idx }"
        @click="switchMode(idx)"
      >
        {{ mode.name }}
      </view>
    </view>

    <swiper
      class="question-swiper"
      :current="currentIndex"
      @change="onSwiperChange"
      :style="{ height: swiperHeight + 'px' }"
    >
      <swiper-item v-for="(q, qi) in questions" :key="qi">
        <scroll-view scroll-y class="question-scroll" :style="{ height: swiperHeight + 'px' }">
          <view class="q-card">
            <view class="q-tag">{{ q.category }}</view>
            <view class="q-title">{{ qi + 1 }}. {{ q.title }}</view>

            <view v-if="currentMode === 0" class="choice-section">
              <view
                v-for="(opt, oi) in q.choice_options"
                :key="oi"
                class="choice-item"
                :class="getChoiceClass(qi, oi)"
                @click="selectChoice(qi, oi)"
              >
                <view class="choice-letter">{{ ['A','B','C','D'][oi] }}</view>
                <view class="choice-text">{{ opt }}</view>
                <view v-if="choiceResults[qi] !== undefined && oi === q.choice_answer" class="choice-check">✓</view>
                <view v-if="choiceResults[qi] !== undefined && oi === choiceResults[qi] && oi !== q.choice_answer" class="choice-wrong">✗</view>
              </view>
              <view v-if="choiceResults[qi] !== undefined" class="feedback" :class="choiceResults[qi] === q.choice_answer ? 'feedback-correct' : 'feedback-wrong'">
                {{ choiceResults[qi] === q.choice_answer ? '回答正确！' : '回答错误，正确答案是 ' + ['A','B','C','D'][q.choice_answer] }}
              </view>
            </view>

            <view v-if="currentMode === 1" class="fill-section">
              <view class="fill-text" v-html="renderFillText(q, qi)"></view>
              <view class="fill-inputs" v-for="(ans, ai) in q.fill_answer" :key="ai">
                <text class="fill-label">第{{ ai + 1 }}空：</text>
                <input
                  class="fill-input"
                  v-model="fillInputs[qi][ai]"
                  :disabled="fillResults[qi] !== undefined"
                  :placeholder="'请输入第' + (ai + 1) + '个空'"
                />
                <text v-if="fillResults[qi] !== undefined" :class="fillResults[qi][ai] ? 'fill-correct' : 'fill-wrong'">
                  {{ fillResults[qi][ai] ? '✓' : '✗ 答案：' + q.fill_answer[ai] }}
                </text>
              </view>
              <view v-if="fillResults[qi] === undefined" class="fill-submit" @click="checkFill(qi)">提交验证</view>
              <view v-if="fillResults[qi] !== undefined" class="fill-retry" @click="retryFill(qi)">重新填写</view>
            </view>

            <view v-if="currentMode === 2" class="answer-section">
              <view class="answer-hint">请先回忆答案，再点击查看</view>
              <view v-if="!answerRevealed[qi]" class="answer-btn" @click="revealAnswer(qi)">点击查看答案</view>
              <view v-else class="answer-content">
                <view class="answer-label">参考答案：</view>
                <view class="answer-text">{{ q.answer }}</view>
                <view class="answer-retry" @click="hideAnswer(qi)">隐藏答案，再回忆一次</view>
              </view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>

    <view class="bottom-bar">
      <view class="nav-btn" :class="{ disabled: currentIndex === 0 }" @click="prevQuestion">上一题</view>
      <view class="nav-center">
        <text>{{ currentMode === 0 ? '选择题模式' : currentMode === 1 ? '填空题模式' : '简答题模式' }}</text>
      </view>
      <view class="nav-btn" :class="{ disabled: currentIndex === questions.length - 1 }" @click="nextQuestion">下一题</view>
    </view>

    <view v-if="currentIndex === questions.length - 1" class="finish-btn" @click="finishPractice">完成练习，查看结果</view>
  </view>
</template>

<script>
import questionData from '@/static/data.js'

export default {
  data() {
    return {
      questions: [],
      currentIndex: 0,
      currentMode: 0,
      modes: [
        { key: 'choice', name: '选择题' },
        { key: 'fill', name: '填空题' },
        { key: 'answer', name: '简答题' }
      ],
      choiceResults: {},
      fillInputs: {},
      fillResults: {},
      answerRevealed: {},
      swiperHeight: 500
    }
  },
  onLoad(options) {
    const cat = decodeURIComponent(options.category || 'all')
    if (cat === 'all') {
      this.questions = questionData
    } else {
      this.questions = questionData.filter(q => q.category === cat)
    }
    this.initState()
    this.calcSwiperHeight()
  },
  methods: {
    initState() {
      this.questions.forEach((q, i) => {
        this.choiceResults[i] = undefined
        this.fillInputs[i] = q.fill_answer ? q.fill_answer.map(() => '') : []
        this.fillResults[i] = undefined
        this.answerRevealed[i] = false
      })
    },
    calcSwiperHeight() {
      const sysInfo = uni.getSystemInfoSync()
      this.swiperHeight = sysInfo.windowHeight - 220
    },
    switchMode(idx) {
      this.currentMode = idx
    },
    selectChoice(qi, oi) {
      if (this.choiceResults[qi] !== undefined) return
      this.$set(this.choiceResults, qi, oi)
    },
    getChoiceClass(qi, oi) {
      const result = this.choiceResults[qi]
      if (result === undefined) return ''
      if (oi === this.questions[qi].choice_answer) return 'choice-correct'
      if (oi === result && oi !== this.questions[qi].choice_answer) return 'choice-error'
      return 'choice-disabled'
    },
    renderFillText(q, qi) {
      let text = q.fill_blank
      text = text.replace(/____/g, '<span class="blank-mark">____</span>')
      return text
    },
    checkFill(qi) {
      const q = this.questions[qi]
      const results = q.fill_answer.map((ans, i) => {
        const input = (this.fillInputs[qi][i] || '').trim()
        return input === ans
      })
      this.$set(this.fillResults, qi, results)
    },
    retryFill(qi) {
      const q = this.questions[qi]
      this.$set(this.fillInputs, qi, q.fill_answer.map(() => ''))
      this.$set(this.fillResults, qi, undefined)
    },
    revealAnswer(qi) {
      this.$set(this.answerRevealed, qi, true)
    },
    hideAnswer(qi) {
      this.$set(this.answerRevealed, qi, false)
    },
    prevQuestion() {
      if (this.currentIndex > 0) {
        this.currentIndex--
      }
    },
    nextQuestion() {
      if (this.currentIndex < this.questions.length - 1) {
        this.currentIndex++
      }
    },
    onSwiperChange(e) {
      this.currentIndex = e.detail.current
    },
    finishPractice() {
      const total = this.questions.length
      let choiceCorrect = 0
      let fillTotal = 0
      let fillCorrect = 0
      let answerTotal = 0

      this.questions.forEach((q, i) => {
        if (this.choiceResults[i] === q.choice_answer) choiceCorrect++
        if (this.answerRevealed[i]) answerTotal++
        if (this.fillResults[i]) {
          const results = this.fillResults[i]
          fillTotal += results.length
          fillCorrect += results.filter(r => r).length
        }
      })

      uni.navigateTo({
        url: '/pages/result/result?total=' + total + '&choiceCorrect=' + choiceCorrect + '&fillCorrect=' + fillCorrect + '&fillTotal=' + fillTotal + '&answerTotal=' + answerTotal
      })
    }
  }
}
</script>

<style scoped>
.container {
  padding-bottom: 40rpx;
}
.top-bar {
  padding: 20rpx 30rpx;
  background: #fff;
}
.progress-wrap {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.progress-bar {
  flex: 1;
  height: 10rpx;
  background: #eee;
  border-radius: 5rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4A90D9, #7B4FD9);
  border-radius: 5rpx;
  transition: width 0.3s;
}
.progress-text {
  font-size: 24rpx;
  color: #999;
  white-space: nowrap;
}
.mode-tabs {
  display: flex;
  margin: 20rpx 30rpx;
  background: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}
.mode-tab {
  flex: 1;
  text-align: center;
  padding: 18rpx 0;
  font-size: 26rpx;
  color: #666;
  transition: all 0.2s;
}
.mode-tab.active {
  background: #4A90D9;
  color: #fff;
  font-weight: bold;
}
.question-swiper {
  width: 100%;
}
.question-scroll {
  padding: 0 30rpx;
  box-sizing: border-box;
}
.q-card {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}
.q-tag {
  display: inline-block;
  background: #f0f4ff;
  color: #4A90D9;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
  border-radius: 6rpx;
  margin-bottom: 16rpx;
}
.q-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.6;
  margin-bottom: 24rpx;
}

.choice-section {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}
.choice-item {
  display: flex;
  align-items: center;
  padding: 20rpx 20rpx;
  border: 2rpx solid #e8e8e8;
  border-radius: 12rpx;
  transition: all 0.2s;
}
.choice-item:active {
  transform: scale(0.98);
}
.choice-letter {
  width: 50rpx;
  height: 50rpx;
  border-radius: 50%;
  background: #f5f5f5;
  text-align: center;
  line-height: 50rpx;
  font-size: 26rpx;
  font-weight: bold;
  color: #666;
  flex-shrink: 0;
  margin-right: 16rpx;
}
.choice-text {
  flex: 1;
  font-size: 26rpx;
  color: #333;
  line-height: 1.5;
}
.choice-correct {
  background: #e8f5e9;
  border-color: #4caf50;
}
.choice-correct .choice-letter {
  background: #4caf50;
  color: #fff;
}
.choice-error {
  background: #ffebee;
  border-color: #f44336;
}
.choice-error .choice-letter {
  background: #f44336;
  color: #fff;
}
.choice-disabled {
  opacity: 0.6;
}
.choice-check {
  color: #4caf50;
  font-size: 28rpx;
  font-weight: bold;
  margin-left: 10rpx;
}
.choice-wrong {
  color: #f44336;
  font-size: 28rpx;
  font-weight: bold;
  margin-left: 10rpx;
}
.feedback {
  padding: 16rpx 20rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  margin-top: 10rpx;
}
.feedback-correct {
  background: #e8f5e9;
  color: #2e7d32;
}
.feedback-wrong {
  background: #ffebee;
  color: #c62828;
}

.fill-section {
  margin-top: 10rpx;
}
.fill-text {
  font-size: 28rpx;
  color: #333;
  line-height: 2;
  margin-bottom: 24rpx;
}
.blank-mark {
  color: #4A90D9;
  font-weight: bold;
  border-bottom: 2rpx solid #4A90D9;
}
.fill-inputs {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  flex-wrap: wrap;
}
.fill-label {
  font-size: 24rpx;
  color: #666;
  margin-right: 10rpx;
}
.fill-input {
  flex: 1;
  min-width: 200rpx;
  border: 2rpx solid #ddd;
  border-radius: 8rpx;
  padding: 12rpx 16rpx;
  font-size: 26rpx;
  height: 56rpx;
}
.fill-correct {
  color: #4caf50;
  font-size: 24rpx;
  margin-left: 10rpx;
}
.fill-wrong {
  color: #f44336;
  font-size: 24rpx;
  margin-left: 10rpx;
}
.fill-submit {
  background: #4A90D9;
  color: #fff;
  text-align: center;
  padding: 18rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  margin-top: 16rpx;
}
.fill-retry {
  background: #f5f5f5;
  color: #666;
  text-align: center;
  padding: 18rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  margin-top: 16rpx;
}

.answer-section {
  margin-top: 10rpx;
}
.answer-hint {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 20rpx;
}
.answer-btn {
  background: #D97B4A;
  color: #fff;
  text-align: center;
  padding: 20rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
}
.answer-content {
  background: #fdf8f5;
  border: 1rpx solid #f0e0d0;
  border-radius: 12rpx;
  padding: 24rpx;
}
.answer-label {
  font-size: 26rpx;
  font-weight: bold;
  color: #D97B4A;
  margin-bottom: 12rpx;
}
.answer-text {
  font-size: 26rpx;
  color: #333;
  line-height: 1.8;
}
.answer-retry {
  text-align: center;
  color: #D97B4A;
  font-size: 24rpx;
  margin-top: 20rpx;
  padding: 10rpx;
}

.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 16rpx 30rpx;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
  z-index: 10;
}
.nav-btn {
  background: #4A90D9;
  color: #fff;
  padding: 14rpx 28rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
}
.nav-btn.disabled {
  background: #ccc;
  color: #999;
}
.nav-center {
  flex: 1;
  text-align: center;
  font-size: 24rpx;
  color: #999;
}
.finish-btn {
  position: fixed;
  bottom: 100rpx;
  left: 30rpx;
  right: 30rpx;
  background: linear-gradient(135deg, #7B4FD9, #4A90D9);
  color: #fff;
  text-align: center;
  padding: 22rpx;
  border-radius: 14rpx;
  font-size: 30rpx;
  font-weight: bold;
  z-index: 10;
}
</style>