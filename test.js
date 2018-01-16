/**
 * @file test.mjs
 * @author leeight
 */
const fs = require('fs');
const {parse} = require('./main');

const code = `
const Button = san.defineComponent({
    dataTypes: {
        /**
         * 设置按钮的禁用状态
         * @bindx
         * @default true
         */
        disabled: DataTypes.bool.isRequired,
        align: DataTypes.oneOf(['left', 'right']),
        // 控制按钮的Loading状态
        loading: DataTypes.bool,
        ariaLabel: DataTypes.string,
        size: DataTypes.string,
        skin: DataTypes.string,
        icon: DataTypes.string,
        label: DataTypes.string
    },
});
`;
console.log(parse(code));
