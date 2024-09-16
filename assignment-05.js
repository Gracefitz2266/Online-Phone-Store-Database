const { MongoClient, ObjectId } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://u230483:Ballylanders2022@grace0.8w6n3ow.mongodb.net/?retryWrites=true&w=majority&appName=Grace0";
    
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("Connected ");

        const db = client.db("Mobile_direct");
        const customersCollection = db.collection("customers");
        const itemDetailsCollection = db.collection("item_details");
        const ordersCollection = db.collection("orders");

        //  customers
        const person1Info = await insertCustomer(customersCollection, {
            title: "Mr",
            name: "Sam",
            surname: "Hill",
            Mobile: "977382",
            email: "Sam.hill@email.com",
            shippingAddress: {
                addressLine1: "123 Tommy Street",
                addressLine2: "CowBell",
                town: "Brid",
                county: "yep County",
                EIRCODE: "TP12345"
            },
            homeAddress: {
                addressLine1: "899 Hilly Street",
                addressLine2: "Polltown",
                town: "Brid",
                county: "Lipo",
                EIRCODE: "H678h80"
            }
        });

        const person2Info = await insertCustomer(customersCollection, {
            title: "Ms",
            name: "Grace",
            surname: "Fitz",
            Mobile: "18956",
            email: "Grace@email.com",
            shippingAddress: {
                addressLine1: "888 Bill Street",
                town: "Sunnytown",
                county: "Bell County",
                EIRCODE: "PO780"
            },
            homeAddress: {
                addressLine1: "129 Kill Street",
                town: "Lazytown",
                county: "Road County",
                EIRCODE: "C467778"
            }
        });

        console.log("Customers inserted:", person1Info.name, person2Info.name);

        //  mobile phone items
        const mobileItems = [
            { Manufacturer: "Apple", Model: "iPhone 14", Price: 999 },
            { Manufacturer: "Samsung", Model: "Samsung Galaxy 1", Price: 789 },
            { Manufacturer: "Nokia", Model: "1st Edition", Price: 699 },
            { Manufacturer: "Huawei", Model: "Huawei 12", Price: 245 },
        ];

        for (const item of mobileItems) {
            await insertItem(itemDetailsCollection, item);
        }

        // Create orders
        const orders = await createOrders(ordersCollection, customersCollection, [person1Info.name, person2Info.name], mobileItems);
        console.log("Orders created:", orders);

        // Retrieve customer's details
        await findCustomer(customersCollection);

        // Retrieve item's details
        await findItem(itemDetailsCollection);

        // Retrieve order's details
        await findOrder(ordersCollection);

        // Update customer's details
        await updateCustomer(customersCollection);
        // Update a item's details
        await updateItem(itemDetailsCollection);
        // Update a order's details
        await updateOrder(ordersCollection);

        // Delete a customer
        await deleteCustomer(customersCollection, "Sam");
        // Delete an item
        await deleteItem(itemDetailsCollection, "iPhone 14");
        // Delete a random order
        await deleteRandomOrder(ordersCollection);

    } catch (e) {
        console.error("An error occurred:", e);
    } finally {
        await client.close();
        console.log("Connection closed");
    }
}

async function insertCustomer(collection, details) {
    // Check if a customer with the same name already exists
    const existingCustomer = await collection.findOne({ name: details.name });
    if (existingCustomer) {
        console.log("Customer created:", details.name);
        return { name: details.name }; // Return existing customer's name
    }

    // If the customer doesn't exist, insert the new customer
    details._id = new ObjectId(); // Generate a unique ID for each customer
    const result = await collection.insertOne(details);
    console.log("Customers created :", details.name);
    return { name: details.name };
}

async function findCustomer(collection) {
    // Count the number of documents in the collection
    const count = await collection.countDocuments();
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);
    // Find one customer document at the random index
    const customer = await collection.findOne({}, { skip: randomIndex });
    // Log the customer details
    console.log("Retrieved customer:", customer);
}

async function updateCustomer(collection) {
    // Count the number of documents in the collection
    const count = await collection.countDocuments();
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);
    // Find one customer document at the random index
    const customer = await collection.findOne({}, { skip: randomIndex });

    // Update customer's personal information and/or address data
    const updateData = {
        $set: {
            title: "Dr", // Update title
            Mobile: "123456", // Update phone number
            email: "123@email.com", // Update email
            "shippingAddress.addressLine1": "Bruff", // Update shipping address line 1
            "homeAddress.addressLine1": "Bruff" // Update home address line 1
        }
    };

    await collection.updateOne({ name: customer.name }, updateData);
    console.log("Customer updated:", customer.name);
}

async function deleteCustomer(collection, customerName) {
    const result = await collection.deleteOne({ name: customerName });
    console.log("Customer deleted:", customerName);
    return { deletedCount: result.deletedCount };
}

async function insertItem(collection, itemDetails) {
    // Check if an item with the same model already exists
    const existingItem = await collection.findOne({ Model: itemDetails.Model });
    if (existingItem) {
        console.log("Item created:", itemDetails.Model);
        return { Model: itemDetails.Model }; // Return existing item's model
    }

    // If the item doesn't exist, insert the new item
    const result = await collection.insertOne(itemDetails);
    console.log("Item created with model:", itemDetails.Model);
    return { Model: itemDetails.Model };
}

async function findItem(collection) {
    // Count the number of documents in the collection
    const count = await collection.countDocuments();
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);
    // Find one item document at the random index
    const item = await collection.findOne({}, { skip: randomIndex });
    // Log the item details
    console.log("Retrieved item:", item);
}

async function updateItem(collection) {
    // Fetch a random item
    const item = await collection.findOne({});
    // Update item details
    const updateData = {
        $set: {
            Manufacturer: "Updated ", // Update manufacturer
            Price: 123 // Update price
        }
    };

    await collection.updateOne({ Model: item.Model }, updateData);
    console.log("Item updated:", item.Model);
}

async function deleteItem(collection, itemName) {
    const result = await collection.deleteOne({ Model: itemName });
    console.log("Item deleted:", itemName);
    return { deletedCount: result.deletedCount };
}

async function findOrder(collection) {
    // Count the number of documents in the collection
    const count = await collection.countDocuments();
    // Generate a random index
    const randomIndex = Math.floor(Math.random() * count);
    // Find one order document at the random index
    const order = await collection.findOne({}, { skip: randomIndex });
    // Log the order details
    console.log("Retreived order:", order);
}

async function updateOrder(collection) {
    // Fetch a random order
    const order = await collection.findOne({});
    // Update order details
    const updateData = {
        $set: {
            status: "Updated Order", // Update status
            dateCompleted: new Date() // Update date completed
        }
    };

    await collection.updateOne({ _id: order._id }, updateData);
    console.log("Order updated:", order._id);
}

async function createOrders(collection, customersCollection, customerNames, items) {
    const orders = [];

    for (const customerName of customerNames) {
        const customer = await customersCollection.findOne({ name: customerName });
        
        // Generate a random number of orders for each customer (between 1 and 4 in this example)
        const numOrders = Math.floor(Math.random() * 4) + 1;

        for (let i = 0; i < numOrders; i++) {
            // Shuffle the items array to randomize the selection
            const shuffledItems = shuffleArray(items);

            // Generate a random number of items for each order (between 1 and 4 in this example)
            const numItems = Math.floor(Math.random() * 4) + 1;

            // Select a subset of items for the order
            const selectedItems = shuffledItems.slice(0, numItems);

            // Create order
            const customerItems = selectedItems.map(item => ({ itemName: item.Model, quantity: 1 }));
            orders.push({ customerName, items: customerItems });
        }
    }

    const result = await collection.insertMany(orders);
    return { insertedCount: result.insertedCount };
}

async function deleteRandomOrder(collection) {
    const count = await collection.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const order = await collection.findOne({}, { skip: randomIndex });
    if (order) {
        const result = await collection.deleteOne({ _id: order._id });
        console.log("order deleted:", order._id);
        return { deletedCount: result.deletedCount };
    } else {
        console.log("No orders found to delete.");
        return { deletedCount: 0 };
    }
}

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

main().catch(console.error);


// to help connect i used https://www.mongodb.com/developer/languages/javascript/node-connect-mongodb
//runned it through mircosoft edge