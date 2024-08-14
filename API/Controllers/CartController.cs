using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class CartController : BaseApiController
    {
        public StoreContext _context;

        public CartController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            Cart cart = await RetrieveCart();

            if (cart == null) return NotFound();

            return MapCartToDto(cart);
        }

        [HttpPost]
        public async Task<ActionResult<CartDto>> AddItemToCart(int productId, int quantity)
        {
            var cart = await RetrieveCart();
            if (cart == null) cart = CreateCart();
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails() { Title = "Product not found" });

            cart.AddItem(product, quantity);

            var result = await _context.SaveChangesAsync();

            return result > 0 ? CreatedAtRoute("GetBasket", MapCartToDto(cart)) : BadRequest(new ProblemDetails() { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveCartItem(int productId, int quantity)
        {
            var cart = await RetrieveCart();

            if (cart == null) return NotFound();

            cart.RemoveItem(productId, quantity);

            var result = await _context.SaveChangesAsync();

            return result > 0 ? Ok() : BadRequest(new ProblemDetails() { Title = "Problem removing item from basket" });
        }


        private async Task<Cart> RetrieveCart()
        {
            return await _context.Carts
                            .Include(i => i.Items)
                            .ThenInclude(p => p.Product)
                            .FirstOrDefaultAsync(x => x.BuyerId == Request.Cookies["buyerId"]);
        }

        private Cart CreateCart()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions() { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);

            var cart = new Cart() { BuyerId = buyerId };

            _context.Carts.Add(cart);

            return cart;

        }

        private CartDto MapCartToDto(Cart cart)
        {
            return new CartDto()
            {
                Id = cart.Id,
                BuyerId = cart.BuyerId,
                Items = cart.Items.Select(i => new CartItemDto()
                {
                    ProductId = i.ProductId,
                    Name = i.Product.Name,
                    Price = i.Product.Price,
                    PictureUrl = i.Product.PictureUrl,
                    Type = i.Product.Type,
                    Brand = i.Product.Brand,
                    Quantity = i.Quantity
                }).ToList()
            };
        }

    }
}