// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract MultiSwap {
    ISwapRouter public immutable swapRouter;

    constructor(ISwapRouter _swapRouter) {
        swapRouter = _swapRouter;
    }

    function swapTokensForSingleToken(
        address[] calldata tokenAddresses,
        uint256[] calldata amounts,
        address outputToken,
        uint256 minOutputAmount,
        address recipient
    ) external {
        require(tokenAddresses.length == amounts.length, "Array lengths do not match");

        for (uint256 i = 0; i < tokenAddresses.length; i++) {
            _swapSingleToken(tokenAddresses[i], amounts[i], outputToken);
        }

        uint256 outputTokenBalance = IERC20(outputToken).balanceOf(address(this));
        require(outputTokenBalance >= minOutputAmount, "Insufficient output amount");
        TransferHelper.safeTransfer(outputToken, recipient, outputTokenBalance);
    }

    function _swapSingleToken(
        address inputToken,
        uint256 amount,
        address outputToken
    ) internal {
        TransferHelper.safeTransferFrom(inputToken, msg.sender, address(this), amount);
        TransferHelper.safeApprove(inputToken, address(swapRouter), amount);

        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: inputToken,
                tokenOut: outputToken,
                fee: 3000, // Example fee tier, adjust as needed
                recipient: address(this),
                deadline: block.timestamp + 15,
                amountIn: amount,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        swapRouter.exactInputSingle(params);
    }
}