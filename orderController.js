async function placeOrder(userId, serviceId, link, quantity) {
    // 1. Fetch service rate from DB
    // 2. Calculate: totalCost = (rate/1000) * quantity
    // 3. Check user balance: if (balance < totalCost) throw Error
    // 4. Deduct balance
    // 5. Forward to SMM Provider:
    /*
        const response = await axios.get(`https://smm-provider.com/api/v2?key=${process.env.SMM_API_KEY}&action=add&service=${serviceId}&link=${link}&quantity=${quantity}`);
    */
    // 6. Save provider_order_id to DB
}
