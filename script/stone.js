// 分页器配置
const paginationConfig = {
    totalPages: 20, // 后端放总页数
    currentPage: 1,
    maxVisiblePages: 3 // 最多显示几个页码（不包括首尾和省略号）
};

// 初始化分页器
function initPagination() {
    renderPagination();
}

// 渲染分页器
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const { totalPages, currentPage, maxVisiblePages } = paginationConfig;

    // 清空当前内容
    pagination.innerHTML = '';

    // 更新页面计数显示
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('jumpPage').value = currentPage;
    document.getElementById('jumpPage').max = totalPages;

    // 添加上一页按钮
    pagination.appendChild(createPaginationItem('prev', '上一页', currentPage === 1));

    // 添加第一页
    pagination.appendChild(createPaginationItem(1));

    // 计算起始和结束页码
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // 调整起始页码
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(2, endPage - maxVisiblePages + 1);
    }

    // 添加左侧省略号
    if (startPage > 2) {
        pagination.appendChild(createEllipsisItem());
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
        pagination.appendChild(createPaginationItem(i));
    }

    // 添加右侧省略号
    if (endPage < totalPages - 1) {
        pagination.appendChild(createEllipsisItem());
    }

    // 添加最后一页
    if (totalPages > 1) {
        pagination.appendChild(createPaginationItem(totalPages));
    }

    // 添加下一页按钮
    pagination.appendChild(createPaginationItem('next', '下一页', currentPage === totalPages));
}

// 创建分页项目
function createPaginationItem(page, text = null, disabled = false) {
    const { currentPage, totalPages } = paginationConfig;
    const li = document.createElement('li');

    if (disabled) {
        li.className = 'disabled';
        const span = document.createElement('span');
        span.innerHTML = text || page;
        li.appendChild(span);
        return li;
    }

    if (page === 'prev') {
        li.className = 'prev-next';
        const a = document.createElement('a');
        a.href = '#'; // 后端
        a.innerHTML = '<i class="fas fa-chevron-left"></i>' + text;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                paginationConfig.currentPage--;
                renderPagination();
            }
        });
        li.appendChild(a);
        return li;
    }

    if (page === 'next') {
        li.className = 'prev-next';
        const a = document.createElement('a');
        a.href = '#'; // 后端
        a.innerHTML = text + '<i class="fas fa-chevron-right"></i>';
        a.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                paginationConfig.currentPage++;
                renderPagination();
            }
        });
        li.appendChild(a);
        return li;
    }

    if (page === currentPage) {
        li.className = 'active';
    }

    const a = document.createElement('a');
    a.href = '#'; // 后端
    a.textContent = page;
    a.addEventListener('click', (e) => {
        e.preventDefault();
        if (page !== currentPage) {
            paginationConfig.currentPage = page;
            renderPagination();
        }
    });

    li.appendChild(a);
    return li;
}

// 创建省略号项目
function createEllipsisItem() {
    const li = document.createElement('li');
    li.className = 'ellipsis';
    const span = document.createElement('span');
    span.innerHTML = '...';
    span.style.color = '#000'; // 设置省略号颜色
    span.style.fontSize = '1.2rem'; // 设置省略号字体大小
    li.appendChild(span);
    return li;
}

// 跳转到指定页面
function jumpPage() {
    const input = document.getElementById('jumpPage');
    let page = parseInt(input.value);

    if (isNaN(page) || page < 1) page = 1;
    if (page > paginationConfig.totalPages) page = paginationConfig.totalPages;

    paginationConfig.currentPage = page;
    renderPagination();
}

// 初始化分页器
document.addEventListener('DOMContentLoaded', initPagination);