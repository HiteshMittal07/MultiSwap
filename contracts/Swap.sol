// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;

import '@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol';
import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

contract MultiSwap {
    ISwapRouter public immutable swapRouter;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function multiSwapExactInputSingle(
        address[] memory tokensIn,
        uint256[] memory amountsIn,
        address tokenOut
    ) external {
        require(tokensIn.length == amountsIn.length, "Array lengths do not match");

        // Track the total amount out
        uint256 totalAmountOut;

        for (uint256 i = 0; i < tokensIn.length; i++) {
            TransferHelper.safeTransferFrom(tokensIn[i], msg.sender, address(this), amountsIn[i]);

            TransferHelper.safeApprove(tokensIn[i], address(swapRouter), amountsIn[i]);

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
        }

        TransferHelper.safeTransfer(tokenOut, msg.sender, totalAmountOut);
    }
}
