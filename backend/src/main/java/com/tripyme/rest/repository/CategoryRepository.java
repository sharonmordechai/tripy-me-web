package com.tripyme.rest.repository;

import com.tripyme.rest.model.Category;
import com.tripyme.rest.model.CategoryName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(CategoryName categoryName);
}
