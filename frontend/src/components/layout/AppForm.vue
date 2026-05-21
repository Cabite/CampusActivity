<!-- AppForm.vue -->
<script setup lang="ts">
import { computed, ref, reactive, provide, watch } from 'vue'
import AppInput from '../common/AppInput.vue'
import AppCard from '../common/AppCard.vue'
import AppButton from '../common/AppButton.vue'
import AppDialog from './AppDialog.vue'
import { cn } from '@/utils'

// 表单项类型
export interface FormField {
  name: string
  label?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search' | 'textarea' | 'select' | 'toggle'
  placeholder?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  leftIcon?: any
  rightIcon?: any
  hint?: string
  rows?: number
  maxlength?: number
  showCount?: boolean  // 添加 showCount 属性
  rules?: Array<(value: any, formData?: Record<string, any>) => string | true>
  
  // Select 专用属性
  options?: Array<{ value: string | number; label: string; disabled?: boolean }>
  selectPlaceholder?: string
  
  // Toggle 专用属性
  toggleLabel?: string
  toggleDescription?: string
}

interface Props {
  fields?: FormField[]
  initialValues?: Record<string, any>
  mode?: 'create' | 'edit' | 'view'
  useCard?: boolean
  cardTitle?: string
  cardDescription?: string
  cardVariant?: 'default' | 'outline' | 'color' | 'color-bg'
  cardColor?: string
  showSubmit?: boolean
  showCancel?: boolean
  submitText?: string
  cancelText?: string
  submitVariant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'blue'
  cancelVariant?: 'default' | 'destructive' | 'outline' | 'ghost' | 'link' | 'blue'
  confirmBeforeSubmit?: boolean
  confirmTitle?: string
  confirmDescription?: string
  confirmText?: string
  layout?: 'vertical' | 'horizontal' | 'grid'
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  submitFullWidth?: boolean
  labelClass?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  fields: () => [],
  initialValues: () => ({}),
  mode: 'create',
  useCard: false,
  cardTitle: '',
  cardDescription: '',
  cardVariant: 'default',
  cardColor: '',
  showSubmit: true,
  showCancel: false,
  submitText: '提交',
  cancelText: '取消',
  submitVariant: 'default',
  cancelVariant: 'outline',
  confirmBeforeSubmit: false,
  confirmTitle: '确认提交',
  confirmDescription: '确定要提交表单吗？',
  confirmText: '确认',
  layout: 'vertical',
  columns: 2,
  gap: 'md',
  loading: false,
  disabled: false,
  submitFullWidth: false,
  labelClass: '',
  class: ''
})

const emit = defineEmits<{
  'submit': [values: Record<string, any>]
  'cancel': []
  'change': [name: string, value: any]
  'field-blur': [name: string, event: FocusEvent]
  'toggle-change': [name: string, value: boolean]
}>()

// 表单数据
const formData = reactive<Record<string, any>>({})

// 字段错误信息
const fieldErrors = reactive<Record<string, string>>({})

// 是否显示确认对话框
const showConfirmDialog = ref(false)

// 提交中状态
const isSubmitting = ref(false)

// 初始化表单数据
const initFormData = () => {
  props.fields.forEach(field => {
    if (formData[field.name] === undefined) {
      const initialValue = props.initialValues[field.name]
      // 为 toggle 类型设置默认值
      if (field.type === 'toggle') {
        formData[field.name] = initialValue ?? false
      } else {
        formData[field.name] = initialValue ?? ''
      }
    }
  })
}

initFormData()

// 监听 initialValues 变化
watch(
  () => props.initialValues,
  () => {
    // 重置表单数据
    props.fields.forEach(field => {
      const initialValue = props.initialValues[field.name]
      if (field.type === 'toggle') {
        formData[field.name] = initialValue ?? false
      } else {
        formData[field.name] = initialValue ?? ''
      }
      fieldErrors[field.name] = ''
    })
  },
  { deep: true }
)

// 间隙类
const gapClass = computed(() => {
  const map = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6'
  }
  return map[props.gap]
})

// 网格列数类
const gridColsClass = computed(() => {
  const map = {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4'
  }
  return map[props.columns as keyof typeof map] || 'md:grid-cols-2'
})

// 布局类
const layoutClass = computed(() => {
  if (props.layout === 'horizontal') {
    return 'flex flex-col space-y-4'
  }
  if (props.layout === 'grid') {
    return `grid grid-cols-1 ${gridColsClass.value} ${gapClass.value}`
  }
  return `flex flex-col ${gapClass.value}`
})

// 验证单个字段
const validateField = (field: FormField, value: any): string => {
  if (field.rules && field.rules.length) {
    for (const rule of field.rules) {
      const result = rule(value, formData)
      if (result !== true) {
        return result
      }
    }
  }
  
  if (field.required) {
    // Toggle 类型特殊处理
    if (field.type === 'toggle') {
      if (value !== true) {
        return `${field.label || field.name}需要开启`
      }
    } else if (!value && value !== 0) {
      return `${field.label || field.name}不能为空`
    }
  }
  
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return '请输入有效的邮箱地址'
    }
  }
  
  if (field.type === 'tel' && value) {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value) && value.length > 0) {
      return '请输入有效的手机号'
    }
  }
  
  return ''
}

// 验证所有字段
const validateForm = (): boolean => {
  let isValid = true
  
  props.fields.forEach(field => {
    const error = validateField(field, formData[field.name])
    fieldErrors[field.name] = error
    if (error) isValid = false
  })
  
  return isValid
}

// 处理字段变化
const handleFieldChange = (name: string, value: any) => {
  formData[name] = value
  if (fieldErrors[name]) {
    const field = props.fields.find(f => f.name === name)
    if (field) {
      const error = validateField(field, value)
      if (!error) {
        fieldErrors[name] = ''
      }
    }
  }
  emit('change', name, value)
}

// 处理 Toggle 变化 - 修复类型
const handleToggleChange = (name: string, value: boolean) => {
  formData[name] = value
  if (fieldErrors[name]) {
    const field = props.fields.find(f => f.name === name)
    if (field) {
      const error = validateField(field, value)
      if (!error) {
        fieldErrors[name] = ''
      }
    }
  }
  emit('change', name, value)
  emit('toggle-change', name, value)
}

// 处理字段失焦
const handleFieldBlur = (name: string, event: FocusEvent) => {
  const field = props.fields.find(f => f.name === name)
  if (field) {
    const error = validateField(field, formData[name])
    fieldErrors[name] = error
  }
  emit('field-blur', name, event)
}

// 提交表单
const submitForm = async () => {
  if (props.disabled || props.loading || isSubmitting.value) return
  
  const isValid = validateForm()
  if (!isValid) {
    const firstError = document.querySelector('[data-field-error="true"]')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }
  
  if (props.confirmBeforeSubmit) {
    showConfirmDialog.value = true
  } else {
    await doSubmit()
  }
}

// 执行提交
const doSubmit = async () => {
  isSubmitting.value = true
  try {
    emit('submit', { ...formData })
  } finally {
    isSubmitting.value = false
    showConfirmDialog.value = false
  }
}

// 重置表单
const resetForm = () => {
  props.fields.forEach(field => {
    if (field.type === 'toggle') {
      formData[field.name] = props.initialValues[field.name] ?? false
    } else {
      formData[field.name] = props.initialValues[field.name] ?? ''
    }
    fieldErrors[field.name] = ''
  })
}

// 设置字段值
const setFieldValue = (name: string, value: any) => {
  formData[name] = value
  // 触发验证
  const field = props.fields.find(f => f.name === name)
  if (field) {
    const error = validateField(field, value)
    fieldErrors[name] = error
  }
}

// 获取字段值
const getFieldValue = (name: string) => {
  return formData[name]
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 暴露方法给父组件
defineExpose({
  resetForm,
  setFieldValue,
  getFieldValue,
  validateForm,
  formData
})

// 提供表单上下文
provide('appForm', {
  formData,
  fieldErrors,
  mode: props.mode,
  disabled: computed(() => props.disabled || props.mode === 'view')
})

// 判断字段类型
const isSelectField = (field: FormField) => field.type === 'select'
const isToggleField = (field: FormField) => field.type === 'toggle'
const isTextareaField = (field: FormField) => field.type === 'textarea'
</script>

<template>
  <div :class="cn('w-full', props.class)">
    
    <!-- 带卡片包装 -->
    <AppCard
      v-if="useCard"
      :variant="cardVariant"
      :color="cardColor"
      :title="cardTitle"
      :description="cardDescription"
      class="overflow-hidden"
    >
      <form
        :class="layoutClass"
        @submit.prevent="submitForm"
      >
        <template
          v-for="field in props.fields"
          :key="field.name"
        >
          <!-- Toggle 字段 -->
          <div 
            v-if="isToggleField(field)"
            :data-field-error="!!fieldErrors[field.name]"
            :class="cn({
              'col-span-full': layout === 'grid'
            })"
          >
            <AppInput
              :model-value="formData[field.name]"
              type="toggle"
              :label="field.label"
              :toggle-label="field.toggleLabel"
              :toggle-description="field.toggleDescription"
              :disabled="props.disabled || field.disabled || props.mode === 'view'"
              :required="field.required"
              :error="fieldErrors[field.name]"
              :hint="field.hint"
              @update:model-value="(val: any) => handleToggleChange(field.name, Boolean(val))"
            />
          </div>

          <!-- Select 字段 -->
          <div 
            v-else-if="isSelectField(field)"
            :data-field-error="!!fieldErrors[field.name]"
            :class="cn({
              'col-span-full': layout === 'grid'
            })"
          >
            <AppInput
              :model-value="formData[field.name]"
              type="select"
              :label="field.label"
              :placeholder="field.placeholder"
              :options="field.options || []"
              :select-placeholder="field.selectPlaceholder"
              :required="field.required"
              :disabled="props.disabled || field.disabled || props.mode === 'view'"
              :left-icon="field.leftIcon"
              :right-icon="field.rightIcon"
              :hint="field.hint"
              :error="fieldErrors[field.name]"
              size="md"
              :label-class="props.labelClass"
              @update:model-value="(val: any) => handleFieldChange(field.name, val)"
              @blur="handleFieldBlur(field.name, $event)"
            />
          </div>

          <!-- Textarea 字段 -->
          <div 
            v-else-if="isTextareaField(field)"
            :data-field-error="!!fieldErrors[field.name]"
            :class="cn({
              'col-span-full': layout === 'grid'
            })"
          >
            <AppInput
              :model-value="formData[field.name]"
              type="text"
              as="textarea"
              :label="field.label"
              :placeholder="field.placeholder"
              :required="field.required"
              :disabled="props.disabled || field.disabled || props.mode === 'view'"
              :readonly="field.readonly || props.mode === 'view'"
              :left-icon="field.leftIcon"
              :right-icon="field.rightIcon"
              :hint="field.hint"
              :error="fieldErrors[field.name]"
              :rows="field.rows || 3"
              :maxlength="field.maxlength"
              :show-count="field.showCount"
              size="md"
              :label-class="props.labelClass"
              @update:model-value="(val: any) => handleFieldChange(field.name, val)"
              @blur="handleFieldBlur(field.name, $event)"
            />
          </div>

          <!-- 普通输入框字段 -->
          <div 
            v-else
            :data-field-error="!!fieldErrors[field.name]"
            :class="cn({
              'col-span-full': layout === 'grid'
            })"
          >
            <AppInput
              :model-value="formData[field.name]"
              :type="field.type as any"
              :label="field.label"
              :placeholder="field.placeholder"
              :required="field.required"
              :disabled="props.disabled || field.disabled || props.mode === 'view'"
              :readonly="field.readonly || props.mode === 'view'"
              :left-icon="field.leftIcon"
              :right-icon="field.rightIcon"
              :hint="field.hint"
              :error="fieldErrors[field.name]"
              :maxlength="field.maxlength"
              size="md"
              :label-class="props.labelClass"
              @update:model-value="(val: any) => handleFieldChange(field.name, val)"
              @blur="handleFieldBlur(field.name, $event)"
            />
          </div>
        </template>

        <div
          v-if="props.mode !== 'view' && (props.showSubmit || props.showCancel)"
          class="mt-4 flex gap-3"
          :class="{
            'col-span-full': layout === 'grid',
            'justify-center': props.submitFullWidth,
          }"
        >
          <AppButton
            v-if="props.showSubmit"
            type="submit"
            :variant="props.submitVariant"
            :loading="props.loading || isSubmitting"
            :disabled="props.disabled"
            :full-width="props.submitFullWidth"
            size="lg"
            :class="props.submitFullWidth ? 'h-11 text-base' : ''"
          >
            {{ props.submitText }}
          </AppButton>

          <AppButton
            v-if="props.showCancel"
            type="button"
            :variant="props.cancelVariant"
            :disabled="props.loading || isSubmitting"
            @click="handleCancel"
          >
            {{ props.cancelText }}
          </AppButton>
        </div>
      </form>
    </AppCard>

    <!-- 不带卡片包装 -->
    <form
      v-else
      :class="layoutClass"
      @submit.prevent="submitForm"
    >
      <template
        v-for="field in props.fields"
        :key="field.name"
      >
        <!-- Toggle 字段 -->
        <div 
          v-if="isToggleField(field)"
          :data-field-error="!!fieldErrors[field.name]"
          :class="cn({
            'col-span-full': layout === 'grid'
          })"
        >
          <AppInput
            :model-value="formData[field.name]"
            type="toggle"
            :label="field.label"
            :toggle-label="field.toggleLabel"
            :toggle-description="field.toggleDescription"
            :disabled="props.disabled || field.disabled || props.mode === 'view'"
            :required="field.required"
            :error="fieldErrors[field.name]"
            :hint="field.hint"
            @update:model-value="(val: any) => handleToggleChange(field.name, Boolean(val))"
          />
        </div>

        <!-- Select 字段 -->
        <div 
          v-else-if="isSelectField(field)"
          :data-field-error="!!fieldErrors[field.name]"
          :class="cn({
            'col-span-full': layout === 'grid'
          })"
        >
          <AppInput
            :model-value="formData[field.name]"
            type="select"
            :label="field.label"
            :placeholder="field.placeholder"
            :options="field.options || []"
            :select-placeholder="field.selectPlaceholder"
            :required="field.required"
            :disabled="props.disabled || field.disabled || props.mode === 'view'"
            :left-icon="field.leftIcon"
            :right-icon="field.rightIcon"
            :hint="field.hint"
            :error="fieldErrors[field.name]"
            size="md"
            :label-class="props.labelClass"
            @update:model-value="(val: any) => handleFieldChange(field.name, val)"
            @blur="handleFieldBlur(field.name, $event)"
          />
        </div>

        <!-- Textarea 字段 -->
        <div 
          v-else-if="isTextareaField(field)"
          :data-field-error="!!fieldErrors[field.name]"
          :class="cn({
            'col-span-full': layout === 'grid'
          })"
        >
          <AppInput
            :model-value="formData[field.name]"
            type="text"
            as="textarea"
            :label="field.label"
            :placeholder="field.placeholder"
            :required="field.required"
            :disabled="props.disabled || field.disabled || props.mode === 'view'"
            :readonly="field.readonly || props.mode === 'view'"
            :left-icon="field.leftIcon"
            :right-icon="field.rightIcon"
            :hint="field.hint"
            :error="fieldErrors[field.name]"
            :rows="field.rows || 3"
            :maxlength="field.maxlength"
            :show-count="field.showCount"
            size="md"
            :label-class="props.labelClass"
            @update:model-value="(val: any) => handleFieldChange(field.name, val)"
            @blur="handleFieldBlur(field.name, $event)"
          />
        </div>

        <!-- 普通输入框字段 -->
        <div 
          v-else
          :data-field-error="!!fieldErrors[field.name]"
          :class="cn({
            'col-span-full': layout === 'grid'
          })"
        >
          <AppInput
            :model-value="formData[field.name]"
            :type="field.type as any"
            :label="field.label"
            :placeholder="field.placeholder"
            :required="field.required"
            :disabled="props.disabled || field.disabled || props.mode === 'view'"
            :readonly="field.readonly || props.mode === 'view'"
            :left-icon="field.leftIcon"
            :right-icon="field.rightIcon"
            :hint="field.hint"
            :error="fieldErrors[field.name]"
            :maxlength="field.maxlength"
            size="md"
            :label-class="props.labelClass"
            @update:model-value="(val: any) => handleFieldChange(field.name, val)"
            @blur="handleFieldBlur(field.name, $event)"
          />
        </div>
      </template>

      <div
        v-if="props.mode !== 'view' && (props.showSubmit || props.showCancel)"
        class="mt-4 flex gap-3"
        :class="{
          'col-span-full': layout === 'grid',
          'justify-center': props.submitFullWidth,
        }"
      >
        <AppButton
          v-if="props.showSubmit"
          type="submit"
          :variant="props.submitVariant"
          :loading="props.loading || isSubmitting"
          :disabled="props.disabled"
          :full-width="props.submitFullWidth"
          size="lg"
          :class="props.submitFullWidth ? 'h-11 text-base' : ''"
        >
          {{ props.submitText }}
        </AppButton>

        <AppButton
          v-if="props.showCancel"
          type="button"
          :variant="props.cancelVariant"
          :disabled="props.loading || isSubmitting"
          @click="handleCancel"
        >
          {{ props.cancelText }}
        </AppButton>
      </div>
    </form>

    <!-- 确认对话框 -->
    <AppDialog
      v-model:open="showConfirmDialog"
      :title="confirmTitle"
      :description="confirmDescription"
      :confirm-text="confirmText"
      cancel-text="取消"
      @confirm="doSubmit"
      @cancel="showConfirmDialog = false"
    />
  </div>
</template>