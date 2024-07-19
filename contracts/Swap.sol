// SPDX-License-Identifier: MIT
pragma solidity =0.7.6;
pragma abicoder v2;
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import '@uniswap/swap-router-contracts/contracts/interfaces/ISwapRouter02.sol';


interface IERC20{
    function transfer(address recipient, uint256 amount) external returns (bool);
    function approve(address spender, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract MultiTokenSwapper {
    ISwapRouter02 public immutable swapRouter;
    constructor(ISwapRouter02 _swapRouter) {
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
            IERC20 token=IERC20(tokenAddresses[i]);
            token.approve(address(swapRouter), amounts[i]);
            token.transferFrom(msg.sender, address(this), amounts[i]);
            

            ISwapRouter02.ExactInputSingleParams memory params = ISwapRouter02.ExactInputSingleParams(
                    tokenAddresses[i],
                    outputToken,
                    uint24(3000),
                    address(this),
                    amounts[i],
                    0,
                    uint160(0)
                );

            swapRouter.exactInputSingle(params);
        }

        IERC20 token = IERC20(outputToken);
        uint256 outputTokenBalance=token.balanceOf(address(this));
        require(outputTokenBalance >= minOutputAmount, "Insufficient output amount");
        token.transfer(recipient, outputTokenBalance);
    }
}
