package com.quolance.quolance_api.dtos;

import lombok.Getter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;

import java.util.List;

@Getter
public class PageResponseDto<T> {
    private final List<T> content;
    private final PaginationMetadata metadata;

    public PageResponseDto(Page<T> page) {
        this.content = page.getContent();
        this.metadata = new PaginationMetadata(page);
    }

    @Getter
    private static class PaginationMetadata {
        private final int pageNumber;
        private final int pageSize;
        private final long totalElements;
        private final int totalPages;
        private final boolean first;
        private final boolean last;
        private final String sortBy;
        private final String sortDirection;

        public PaginationMetadata(Page<?> page) {
            this.pageNumber = page.getNumber();
            this.pageSize = page.getSize();
            this.totalElements = page.getTotalElements();
            this.totalPages = page.getTotalPages();
            this.first = page.isFirst();
            this.last = page.isLast();

            Sort sort = page.getSort();
            if (sort.isSorted()) {
                Sort.Order order = sort.iterator().next();
                this.sortBy = order.getProperty();
                this.sortDirection = order.getDirection().name().toLowerCase();
            } else {
                this.sortBy = null;
                this.sortDirection = null;
            }
        }
    }
}