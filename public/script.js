const API = "http://localhost:3000/api";

async function loadProducts() {
    const container = document.getElementById("products-container");
    const search = document.getElementById("search").value;
    const categoria = document.getElementById("category-filter").value;

    let url = `${API}/produtos?`;
    if (search) url += `search=${search}&`;
    if (categoria) url += `categoria=${categoria}`;

    try {
        const res = await fetch(url);
        const products = await res.json();

        container.innerHTML = "";

        if (products.length === 0) {
            container.innerHTML = `<p class="col-span-full text-center text-slate-500 py-8">Nenhum produto encontrado.</p>`;
            return;
        }

        products.forEach((p) => {
            const card = `
                        <div class="product-card bg-white border rounded-3xl overflow-hidden flex flex-col">
                            <img src="${p.imagem_url || "https://picsum.photos/id/201/300/160"}" class="w-full h-40 object-cover">
                            <div class="p-5 flex-1 flex flex-col">
                                <div class="flex-1">
                                    <h3 class="font-bold text-lg">${p.nome}</h3>
                                    <p class="text-sm text-slate-600 mt-1 line-clamp-2">${p.descricao || ""}</p>
                                </div>
                                
                                <div class="mt-4">
                                    <div class="flex justify-between items-center">
                                        <span class="text-2xl font-bold text-emerald-600">R$ ${parseFloat(p.preco).toFixed(2)}</span>
                                        <span class="text-xs px-3 py-1 bg-slate-100 rounded-full">${p.estoque} em estoque</span>
                                    </div>
                                    
                                    <div class="flex gap-x-2 mt-4">
                                        <button onclick="editProduct(${p.id})" class="flex-1 text-sm py-2 border rounded-2xl hover:bg-slate-50">Editar</button>
                                        <button onclick="deleteProduct(${p.id})" class="flex-1 text-sm py-2 border border-red-200 text-red-600 rounded-2xl hover:bg-red-50">Excluir</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
            container.innerHTML += card;
        });
    } catch (err) {
        container.innerHTML = `<p class="text-red-500">Erro ao carregar produtos. Verifique se o backend está rodando.</p>`;
    }
}

function showAddModal() {
    document.getElementById("product-form").reset();
    document.getElementById("product-id").value = "";
    document.getElementById("modal-title").innerText = "Novo Produto";
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modal").classList.add("flex");
}

async function editProduct(id) {
    const res = await fetch(`${API}/produtos`);
    const products = await res.json();
    const product = products.find((p) => p.id == id);

    if (!product) return;

    document.getElementById("product-id").value = product.id;
    document.getElementById("nome").value = product.nome;
    document.getElementById("descricao").value = product.descricao || "";
    document.getElementById("preco").value = product.preco;
    document.getElementById("estoque").value = product.estoque;
    document.getElementById("categoria").value =
        product.categoria || "Periféricos";

    document.getElementById("modal-title").innerText = "Editar Produto";
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modal").classList.add("flex");
}

function hideModal() {
    document.getElementById("modal").classList.remove("flex");
    document.getElementById("modal").classList.add("hidden");
}

async function saveProduct(e) {
    e.preventDefault();
    const id = document.getElementById("product-id").value;
    const isEdit = !!id;

    const data = {
        nome: document.getElementById("nome").value,
        descricao: document.getElementById("descricao").value,
        preco: parseFloat(document.getElementById("preco").value),
        estoque: parseInt(document.getElementById("estoque").value) || 0,
        categoria: document.getElementById("categoria").value,
    };

    try {
        let res;
        if (isEdit) {
            res = await fetch(`${API}/produtos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        } else {
            res = await fetch(`${API}/produtos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
        }

        if (res.ok) {
            hideModal();
            loadProducts();
        } else {
            alert("Erro ao salvar produto");
        }
    } catch (err) {
        alert("Erro de conexão com o backend");
    }
}

async function deleteProduct(id) {
    if (!confirm("Excluir este produto?")) return;
    await fetch(`${API}/produtos/${id}`, { method: "DELETE" });
    loadProducts();
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    loadProducts();
});
