<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { cn } from '@/utils'
import { Eye, EyeOff, AlertCircle, CheckCircle, X, ChevronDown, Check } from 'lucide-vue-next'

interface Props {
  // 基础属性 - modelValue 支持 boolean
  modelValue?: string | number | boolean
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'select' | 'toggle'
  placeholder?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  
  // 尺寸
  size?: 'sm' | 'md' | 'lg'
  
  // 状态
  error?: string
  success?: boolean
  loading?: boolean
  
  // 图标
  leftIcon?: any
  rightIcon?: any
  
  // 清空按钮
  clearable?: boolean
  
  // 标签
  label?: string
  labelClass?: string
  
  // 提示信息
  hint?: string
  
  // 其他
  rows?: number
  maxlength?: number
  showCount?: boolean
  autocomplete?: string
  
  // Select 专用属性
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>
  selectPlaceholder?: string
  
  // Toggle 专用属性
  toggleLabel?: string
  toggleDescription?: string
  
  // Textarea 专用属性
  as?: 'textarea' | 'input'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
  readonly: false,
  required: false,
  size: 'md',
  error: '',
  success: false,
  loading: false,
  clearable: false,
  label: '',
  labelClass: '',
  hint: '',
  rows: 3,
  maxlength: undefined,
  showCount: false,
  autocomplete: 'off',
  options: () => [],
  selectPlaceholder: '请选择',
  toggleLabel: '',
  toggleDescription: '',
  as: 'input'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number | boolean]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'change': [event: Event]
  'input': [event: Event]
  'clear': []
  'toggle-change': [value: boolean]
}>()

const attrs = useAttrs()

// 是否显示密码
const showPassword = ref(false)

// Select 下拉状态
const isSelectOpen = ref(false)
const selectRef = ref<HTMLElement>()

// 输入框类型
const inputType = computed(() => {
  if (props.type === 'password' && showPassword.value) {
    return 'text'
  }
  return props.type
})

// 将 modelValue 转换为字符串用于输入框
const inputValue = computed(() => {
  if (props.modelValue === undefined || props.modelValue === null) {
    return ''
  }
  // 将 boolean 转换为字符串
  if (typeof props.modelValue === 'boolean') {
    return props.modelValue ? 'true' : 'false'
  }
  return String(props.modelValue)
})

// 是否可清空
const showClear = computed(() => {
  return props.clearable && 
         !props.disabled && 
         !props.readonly && 
         (props.modelValue !== '' && props.modelValue !== undefined && props.modelValue !== null) &&
         props.type !== 'toggle'
})

// 是否显示错误图标
const showErrorIcon = computed(() => {
  return props.error && !props.success && !props.loading && props.type !== 'toggle'
})

// 是否显示成功图标
const showSuccessIcon = computed(() => {
  return props.success && !props.error && !props.loading && props.type !== 'toggle'
})

// 输入框尺寸类
const sizeClass = computed(() => {
  const map = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg'
  }
  return map[props.size]
})

// 图标尺寸
const iconSize = computed(() => {
  const map = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }
  return map[props.size]
})

// 输入框基础类
const inputBaseClass = computed(() => {
  if (props.type === 'toggle') return ''
  
  return cn(
    'w-full rounded-lg border transition-all duration-200 outline-none',
    'focus:ring-2 focus:ring-offset-0',
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
    'readonly:bg-gray-50',
    sizeClass.value,
    {
      // 正常状态
      'border-gray-300 bg-white hover:border-gray-400 focus:border-primary focus:ring-primary/20': 
        !props.error && !props.success,
      
      // 错误状态
      'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500/20': 
        props.error && !props.success,
      
      // 成功状态
      'border-green-500 bg-green-50 focus:border-green-500 focus:ring-green-500/20': 
        props.success && !props.error,
      
      // 左内边距（有左图标）
      'pl-10': props.leftIcon,
      
      // 右内边距（有右图标、清空按钮、密码切换、状态图标）
      'pr-10': (props.rightIcon || showClear.value || props.type === 'password' || showErrorIcon.value || showSuccessIcon.value || props.loading) && props.type !== 'select'
    }
  )
})

// Select 样式类
const selectClass = computed(() => {
  return cn(
    'w-full rounded-lg border transition-all duration-200 outline-none cursor-pointer',
    'focus:ring-2 focus:ring-primary/20',
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60',
    sizeClass.value,
    {
      'border-gray-300 bg-white hover:border-gray-400': !props.error && !props.success,
      'border-red-500 bg-red-50': props.error && !props.success,
      'border-green-500 bg-green-50': props.success && !props.error,
      'pl-10': props.leftIcon,
      'pr-10': true
    }
  )
})

// 选中的选项
const selectedOption = computed(() => {
  if (props.type === 'select') {
    return props.options.find(opt => opt.value === props.modelValue)
  }
  return null
})

// 显示文本
const selectDisplayText = computed(() => {
  if (props.type === 'select') {
    return selectedOption.value?.label || props.selectPlaceholder
  }
  return ''
})

// 清除输入
const handleClear = () => {
  if (props.disabled || props.readonly) return
  emit('update:modelValue', '')
  emit('clear')
}

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 更新值 - 处理输入框的值
const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value
  
  if (props.type === 'number') {
    value = value === '' ? '' : Number(value)
  }
  
  emit('update:modelValue', value)
}

// 选择选项
const selectOption = (value: string | number) => {
  if (props.disabled) return
  emit('update:modelValue', value)
  isSelectOpen.value = false
}

// 切换 Select 下拉框
const toggleSelect = () => {
  if (props.disabled || props.readonly) return
  isSelectOpen.value = !isSelectOpen.value
}

// 点击外部关闭 Select
const handleClickOutside = (event: MouseEvent) => {
  if (selectRef.value && !selectRef.value.contains(event.target as Node)) {
    isSelectOpen.value = false
  }
}

// 监听点击外部
if (typeof window !== 'undefined') {
  window.addEventListener('click', handleClickOutside)
}

// 字符计数
const currentLength = computed(() => {
  const value = props.modelValue?.toString() || ''
  return value.length
})

const isTextarea = computed(() => {
  return props.as === 'textarea' || (attrs['rows'] !== undefined && props.type === 'text')
})

// Toggle 值
const toggleValue = computed({
  get: () => Boolean(props.modelValue),
  set: (val: boolean) => {
    emit('update:modelValue', val)
    emit('toggle-change', val)
  }
})
</script>

<template>
  <div class="w-full">
    <!-- 标签 -->
    <label v-if="label && type !== 'toggle'" :class="cn('mb-2 block text-sm font-medium', labelClass)">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Toggle 组件 -->
    <div v-if="type === 'toggle'" class="flex items-center justify-between">
      <div v-if="toggleLabel || label || toggleDescription" class="flex flex-col">
        <span class="text-sm font-medium text-gray-900">{{ toggleLabel || label }}</span>
        <span v-if="toggleDescription" class="text-sm text-gray-500">{{ toggleDescription }}</span>
      </div>
      <button
        type="button"
        role="switch"
        :aria-checked="toggleValue"
        :disabled="disabled"
        :class="cn(
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          {
            'bg-primary': toggleValue,
            'bg-gray-200': !toggleValue,
            'opacity-50 cursor-not-allowed': disabled
          }
        )"
        @click="toggleValue = !toggleValue"
      >
        <span
          :class="cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
            {
              'translate-x-5': toggleValue,
              'translate-x-0': !toggleValue
            }
          )"
        />
      </button>
    </div>

    <!-- Select 组件 -->
    <div v-else-if="type === 'select'" ref="selectRef" class="relative">
      <div
        :class="selectClass"
        @click="toggleSelect"
      >
        <div v-if="leftIcon" class="absolute left-3 top-1/2 -translate-y-1/2">
          <component :is="leftIcon" class="text-gray-400" :class="iconSize" />
        </div>
        
        <span :class="cn('block truncate', {
          'text-gray-900': selectedOption,
          'text-gray-400': !selectedOption
        })">
          {{ selectDisplayText }}
        </span>
        
        <div class="absolute right-3 top-1/2 -translate-y-1/2">
          <ChevronDown :class="cn('text-gray-400 transition-transform duration-200', iconSize, {
            'rotate-180': isSelectOpen
          })" />
        </div>
      </div>

      <!-- 下拉选项 -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-if="isSelectOpen"
          class="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"
        >
          <div class="max-h-60 overflow-y-auto">
            <div
              v-for="option in options"
              :key="option.value"
              :class="cn(
                'px-4 py-2 cursor-pointer flex items-center justify-between transition-colors',
                {
                  'bg-primary/10 text-primary': option.value === modelValue,
                  'hover:bg-gray-50': option.value !== modelValue,
                  'opacity-50 cursor-not-allowed': option.disabled
                }
              )"
              @click="!option.disabled && selectOption(option.value)"
            >
              <span>{{ option.label }}</span>
              <Check v-if="option.value === modelValue" class="w-4 h-4 text-primary" />
            </div>
            
            <div v-if="options.length === 0" class="px-4 py-2 text-gray-400 text-center">
              暂无选项
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 普通输入框/文本域 -->
    <template v-else>
      <div class="relative">
        <!-- 左图标 -->
        <div 
          v-if="leftIcon" 
          class="absolute left-3 top-1/2 -translate-y-1/2"
          :class="iconSize"
        >
          <component :is="leftIcon" class="text-gray-400" :class="iconSize" />
        </div>

        <!-- 输入框/文本域 - 使用 inputValue 而不是直接使用 modelValue -->
        <textarea
          v-if="isTextarea"
          :value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :rows="rows"
          :maxlength="maxlength"
          :class="cn(inputBaseClass, 'resize-y min-h-[80px]')"
          @input="updateValue"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @change="$emit('change', $event)"
          v-bind="attrs"
        />
        
        <input
          v-else
          :type="inputType"
          :value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :required="required"
          :maxlength="maxlength"
          :autocomplete="autocomplete"
          :class="inputBaseClass"
          @input="updateValue"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @change="$emit('change', $event)"
          v-bind="attrs"
        />

        <!-- 右侧按钮组 -->
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <!-- 加载状态 -->
          <div v-if="loading" class="animate-spin rounded-full border-2 border-primary border-t-transparent" :class="iconSize" />

          <!-- 成功图标 -->
          <CheckCircle v-else-if="showSuccessIcon" class="text-green-500" :class="iconSize" />

          <!-- 错误图标 -->
          <AlertCircle v-else-if="showErrorIcon" class="text-red-500" :class="iconSize" />

          <!-- 清空按钮 -->
          <button
            v-else-if="showClear"
            type="button"
            class="rounded-full p-0.5 hover:bg-gray-100 transition-colors"
            @click="handleClear"
          >
            <X class="text-gray-400 hover:text-gray-600" :class="iconSize" />
          </button>

          <!-- 密码切换按钮 -->
          <button
            v-else-if="type === 'password'"
            type="button"
            class="rounded-full p-0.5 hover:bg-gray-100 transition-colors"
            @click="togglePasswordVisibility"
          >
            <Eye v-if="showPassword" class="text-gray-400" :class="iconSize" />
            <EyeOff v-else class="text-gray-400" :class="iconSize" />
          </button>

          <!-- 右图标 -->
          <component 
            v-else-if="rightIcon" 
            :is="rightIcon" 
            class="text-gray-400" 
            :class="iconSize" 
          />
        </div>
      </div>
    </template>

    <!-- 底部提示区域 -->
    <div v-if="type !== 'toggle'" class="mt-1.5 flex justify-between items-start gap-2 text-xs">
      <div v-if="error" class="text-red-500 flex items-center gap-1">
        <AlertCircle class="w-3 h-3" />
        <span>{{ error }}</span>
      </div>
      <div v-else-if="hint && !error" class="text-gray-400">
        {{ hint }}
      </div>
      <div v-else class="text-gray-400">
        &nbsp;
      </div>
      
      <div v-if="showCount && maxlength" class="text-gray-400 flex-shrink-0">
        {{ currentLength }} / {{ maxlength }}
      </div>
    </div>
  </div>
</template>