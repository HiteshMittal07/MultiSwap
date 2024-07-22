// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

interface IERC20{
        function approve(address spender, uint256 amount) external returns (bool);
        function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
        function transfer(address recipient, uint256 amount) external returns (bool);
        function balanceOf(address account) external view returns (uint256);
}
contract MultiSwap {
    ISwapRouter public immutable swapRouter;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }
    event amount(uint256 value);
    function multiSwapExactInputSingle(
        address[] memory tokensIn,
        uint256[] memory amountsIn,
        address tokenOut
    ) external {
        require(tokensIn.length == amountsIn.length, "Array lengths do not match");

        uint256 totalAmountOut;

        for (uint256 i = 0; i < tokensIn.length; i++) {
            IERC20 token=IERC20(tokensIn[i]);
            token.transferFrom( msg.sender, address(this), amountsIn[i]);

            token.approve(address(swapRouter), amountsIn[i]);

            ISwapRouter.ExactInputSingleParams memory params =
                ISwapRouter.ExactInputSingleParams({
                    tokenIn: tokensIn[i],
                    tokenOut: tokenOut,
                    fee: 3000,
                    recipient: msg.sender,
                    deadline: block.timestamp, 
                    amountIn: amountsIn[i],
                    amountOutMinimum: 0,
                    sqrtPriceLimitX96: 0
                });
            uint256 amountOut = swapRouter.exactInputSingle(params);

            totalAmountOut += amountOut;
            emit amount(totalAmountOut);
        }
    }
    function balance_of(address token)public view returns(uint256){
        IERC20 token_out=IERC20(token);
        return token_out.balanceOf(address(this));
    }
}
