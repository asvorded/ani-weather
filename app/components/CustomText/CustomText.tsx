import React from 'react';
import { Text } from 'react-native';
import { styles } from './CustomText.styles';
import { CustomTextProps } from './CustomText.types';


export const CustomText: React.FC<CustomTextProps> = ({ children, style, ...restProps }: CustomTextProps) => {
    return (
        <Text
            style={[styles.text, style]}
            {...restProps}
        >
            {children}
        </Text>
    );
};
