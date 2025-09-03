import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { Platform, TextInput, View, Pressable, type TextInputProps } from 'react-native';
import { Icon } from './icon';
import { Eye, EyeOff } from 'lucide-react-native';

// Forward ref so parent screens can imperatively focus() the underlying TextInput
const Input = React.forwardRef<TextInput, TextInputProps & { className?: string }>(
  ({ className, style, secureTextEntry, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = !!secureTextEntry;
    const effectiveSecure = isPassword && !showPassword;

    const paddingStyle = { paddingRight: isPassword ? 48 : undefined } as const;
    const combinedStyle = Array.isArray(style)
      ? [paddingStyle, ...style]
      : [paddingStyle, style];

    const input = (
      <TextInput
        ref={ref}
        className={cn(
          'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 shadow-sm shadow-black/5 sm:h-9',
          props.editable === false &&
            cn(
              'opacity-50',
              Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
            ),
          Platform.select({
            web: cn(
              'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive'
            ),
            native: 'placeholder:text-muted-foreground/50',
          }),
          className
        )}
        {...props}
        secureTextEntry={effectiveSecure}
        style={combinedStyle as any}
      />
    );

    if (!isPassword) return input;

    return (
      <View style={{ position: 'relative', width: '100%' }}>
        {input}
        <Pressable
          onPress={() => setShowPassword(v => !v)}
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: [{ translateY: -20 }],
            zIndex: 10,
            padding: 8,
          }}
          accessibilityRole="button"
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <Icon as={showPassword ? EyeOff : Eye} size={18} className="text-foreground" />
        </Pressable>
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
